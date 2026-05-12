/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import {
    collection,
    deleteField,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where
} from "firebase/firestore";
import { auth, db } from '../services/firebase/FirebaseConfig';

const AuthContext = createContext();
const PROFILE_PHOTO_STORAGE_PREFIX = 'lumina_profile_photo_';
const PROFILE_PHOTO_MAX_DIMENSION = 260;
const PROFILE_PHOTO_MAX_DATA_URL_LENGTH = 240000;

const getProfilePhotoKey = (uid) => `${PROFILE_PHOTO_STORAGE_PREFIX}${uid}`;

const getStoredProfilePhoto = (uid) => {
    if (!uid || typeof window === 'undefined') return '';

    try {
        return localStorage.getItem(getProfilePhotoKey(uid)) || '';
    } catch {
        return '';
    }
};

const saveStoredProfilePhoto = (uid, dataUrl) => {
    if (!uid || !dataUrl || typeof window === 'undefined') return;

    try {
        localStorage.setItem(getProfilePhotoKey(uid), dataUrl);
    } catch {
        throw new Error('No se pudo guardar la foto en este navegador. Intenta con una imagen mas liviana.');
    }
};

const getSafePhotoURL = (photoURL) => {
    if (!photoURL || typeof photoURL !== 'string') return '';
    return photoURL.startsWith('data:') ? '' : photoURL;
};

const buildUserState = (authUser, userData = {}, fallback = {}) => ({
    uid: authUser.uid,
    email: authUser.email || userData.email || fallback.email || '',
    displayName: authUser.displayName || fallback.displayName || '',
    username: userData.username || fallback.username || authUser.displayName || authUser.email?.split('@')[0] || '',
    usernameLower: userData.usernameLower || fallback.usernameLower || '',
    firstName: userData.firstName || fallback.firstName || '',
    lastName: userData.lastName || fallback.lastName || '',
    phone: userData.phone || fallback.phone || '',
    bio: userData.bio || fallback.bio || '',
    photoURL: getStoredProfilePhoto(authUser.uid) || getSafePhotoURL(userData.photoURL) || fallback.photoURL || authUser.photoURL || ''
});

const normalizeProfileUpdates = (updates, currentUser) => {
    const username = updates.username?.trim() || currentUser?.username || '';

    return {
        username,
        usernameLower: username.toLowerCase(),
        firstName: updates.firstName?.trim() || '',
        lastName: updates.lastName?.trim() || '',
        email: currentUser?.email || updates.email || '',
        phone: updates.phone?.trim() || '',
        bio: updates.bio?.trim() || '',
        ...(updates.photoURL && !updates.photoURL.startsWith('data:') ? { photoURL: updates.photoURL } : {})
    };
};

const loadImageFromUrl = (url) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Tu navegador no pudo procesar esta imagen. Prueba con JPG, PNG, WEBP, GIF, BMP o AVIF.'));
    image.src = url;
});

const compressProfilePhoto = async (file, onProgress) => {
    onProgress?.(15);

    const objectUrl = URL.createObjectURL(file);

    try {
        const image = await loadImageFromUrl(objectUrl);

        if (!image.naturalWidth || !image.naturalHeight) {
            throw new Error('No se pudo leer el tamano de esta imagen.');
        }

        const size = Math.min(PROFILE_PHOTO_MAX_DIMENSION, image.naturalWidth, image.naturalHeight);
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = Math.max(0, Math.floor((image.naturalWidth - sourceSize) / 2));
        const sourceY = Math.max(0, Math.floor((image.naturalHeight - sourceSize) / 2));
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('No se pudo preparar la imagen para guardarla.');
        }

        canvas.width = size;
        canvas.height = size;
        context.fillStyle = '#061635';
        context.fillRect(0, 0, size, size);
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);

        onProgress?.(65);

        let quality = 0.78;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        while (dataUrl.length > PROFILE_PHOTO_MAX_DATA_URL_LENGTH && quality > 0.42) {
            quality -= 0.08;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        if (dataUrl.length > PROFILE_PHOTO_MAX_DATA_URL_LENGTH) {
            throw new Error('La imagen sigue siendo muy pesada. Intenta con otra foto mas liviana.');
        }

        onProgress?.(100);
        return dataUrl;
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const getUserDocByUsername = async (username) => {
        const normalized = username.trim().toLowerCase();
        const usersRef = collection(db, 'usuarios');
        const usernameQuery = query(usersRef, where('usernameLower', '==', normalized));
        const querySnapshot = await getDocs(usernameQuery);
        return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
    };

    const register = async (email, password, username) => {
        const normalized = username.trim().toLowerCase();
        const usernameExists = await getUserDocByUsername(normalized);

        if (usernameExists) {
            const error = new Error('El nombre de usuario ya esta en uso.');
            error.code = 'auth/username-already-in-use';
            throw error;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userData = {
            uid: userCredential.user.uid,
            email,
            username: username.trim(),
            usernameLower: normalized,
            createdAt: serverTimestamp(),
        };

        setCurrentUser(buildUserState(userCredential.user, userData));

        setDoc(doc(db, 'usuarios', userCredential.user.uid), userData, { merge: true }).catch((error) => {
            console.error('Error saving user profile:', error);
        });

        return userCredential;
    };

    const login = async (email, password, username) => {
        let loginEmail = email;

        if (!loginEmail && username) {
            const userDoc = await getUserDocByUsername(username);
            if (!userDoc) {
                const error = new Error('Usuario no encontrado.');
                error.code = 'auth/user-not-found';
                throw error;
            }
            loginEmail = userDoc.email;
        }

        return signInWithEmailAndPassword(auth, loginEmail, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const updateUserProfile = async (updates) => {
        const uid = currentUser?.uid || auth.currentUser?.uid;
        if (!uid) {
            throw new Error('No hay un usuario activo para actualizar.');
        }

        const profileUpdates = normalizeProfileUpdates(updates, currentUser);

        const previousUser = currentUser;

        setCurrentUser(prev => ({
            ...prev,
            ...profileUpdates,
            uid
        }));

        try {
            const firestoreUpdates = {
                uid,
                ...profileUpdates,
                updatedAt: serverTimestamp()
            };

            if (updates.removeRemotePhotoURL) {
                firestoreUpdates.photoURL = deleteField();
                firestoreUpdates.photoStoredLocally = true;
            }

            await setDoc(doc(db, 'usuarios', uid), firestoreUpdates, { merge: true });
        } catch (error) {
            if (previousUser) {
                setCurrentUser(previousUser);
            }
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    const uploadProfilePhoto = async (file, onProgress) => {
        const activeUser = auth.currentUser;
        const uid = currentUser?.uid || activeUser?.uid;

        if (!uid || !activeUser) {
            throw new Error('Debes iniciar sesion para subir una foto.');
        }

        const photoURL = await compressProfilePhoto(file, onProgress);
        saveStoredProfilePhoto(uid, photoURL);
        setCurrentUser(prev => prev ? { ...prev, photoURL } : prev);
        return photoURL;
    };

    const saveUserProfile = async (updates, photoFile, onPhotoProgress) => {
        let photoURL = currentUser?.photoURL || '';

        if (photoFile) {
            photoURL = await uploadProfilePhoto(photoFile, onPhotoProgress);
        }

        await updateUserProfile({
            ...updates,
            ...(photoURL && !photoURL.startsWith('data:') ? { photoURL } : {}),
            ...(photoFile ? { removeRemotePhotoURL: true } : {})
        });

        if (photoURL) {
            setCurrentUser(prev => prev ? { ...prev, photoURL } : prev);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userSnapshot = await getDoc(doc(db, 'usuarios', user.uid));
                    const userData = userSnapshot.exists() ? userSnapshot.data() : {};

                    setCurrentUser(prev => buildUserState(
                        user,
                        userData,
                        prev?.uid === user.uid ? prev : {}
                    ));
                } catch (error) {
                    console.error('Error cargando datos del usuario:', error);
                    setCurrentUser(prev => buildUserState(
                        user,
                        {},
                        prev?.uid === user.uid ? prev : {}
                    ));
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        register,
        login,
        logout,
        updateUserProfile,
        uploadProfilePhoto,
        saveUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
