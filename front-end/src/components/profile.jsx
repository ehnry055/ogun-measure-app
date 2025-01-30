import { useAuth0, useEffect, useState } from "@auth0/auth0-react";
import React from "react";

const Profile = () => {
  console.log("test");
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  if(isAuthenticated) {
    const token = getAccessTokenSilently();
    console.log(token);
    //const decodedToken = jwtDecode(token);
    //console.log(decodedToken.roles);
  }

  return (
    isAuthenticated && (
      <article className="column">
        {user?.picture && <img src={user.picture} alt={user?.name} />}
      </article>
    )
  );
};

export default Profile;