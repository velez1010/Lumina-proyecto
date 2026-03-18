import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p>This is the profile page.</p>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>Correo: {user.email}</p>
    </div>
  );
};

export default Profile;

