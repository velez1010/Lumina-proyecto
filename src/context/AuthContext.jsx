import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../services/firebase/FirebaseConfig';

const AuthContext = createContext();

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
            const error = new Error('El nombre de usuario ya está en uso.');
            error.code = 'auth/username-already-in-use';
            throw error;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email,
            username: username.trim(),
            usernameLower: normalized,
            createdAt: serverTimestamp(),
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}