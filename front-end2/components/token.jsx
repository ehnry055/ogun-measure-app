"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Token = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessTokenSilently({
        });

        const decoded = jwtDecode(accessToken);
        console.log(decoded)

        setDecodedToken(decoded);
        console.log("Decoded Token:", decoded);
      }
    };

    fetchAndDecodeToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div>
      <h3>Decoded Token</h3>
      {decodedToken ? (
        <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
      ) : (
        <p>Loading or not authenticated</p>
      )}
    </div>
  );
};

export default Token;