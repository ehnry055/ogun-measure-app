import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import UnAuthorized from "../pages/UnAuthorized";

const PrivateRoute = ({ Component, requiredPermissions = [] }) => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const permissionKey = requiredPermissions.join("|");
  const neededPermissions = permissionKey ? permissionKey.split("|") : [];
  const [hasRequiredPermission, setHasRequiredPermission] = useState(
    neededPermissions.length === 0
  );
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(
    neededPermissions.length > 0
  );

  useEffect(() => {
    let isMounted = true;

    const checkPermissions = async () => {
      if (!isAuthenticated || neededPermissions.length === 0) {
        if (isMounted) {
          setHasRequiredPermission(neededPermissions.length === 0);
          setIsCheckingPermissions(false);
        }
        return;
      }

      setIsCheckingPermissions(true);

      try {
        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        const userPermissions = decodedToken.permissions || [];
        const canAccess = neededPermissions.some((permission) =>
          userPermissions.includes(permission)
        );

        if (isMounted) {
          setHasRequiredPermission(canAccess);
        }
      } catch (error) {
        console.error("Error checking route permissions:", error);
        if (isMounted) {
          setHasRequiredPermission(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingPermissions(false);
        }
      }
    };

    if (!isLoading) {
      checkPermissions();
    }

    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    permissionKey,
    neededPermissions.length,
  ]);

  if (isLoading || isCheckingPermissions) {
    return null;
  }

  if (!isAuthenticated) {
    return <UnAuthorized />;
  }

  if (neededPermissions.length > 0 && !hasRequiredPermission) {
    return <UnAuthorized />;
  }

  return <Component />;
};

export default PrivateRoute;
