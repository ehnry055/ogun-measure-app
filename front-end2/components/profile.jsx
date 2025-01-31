"use client";
import { useUser } from "@auth0/nextjs-auth0";


const Profile = () => {
  console.log("test");
  const { user, isAuthenticated, getAccessTokenSilently } = useUser();
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