"use client";
import { useUser } from "@auth0/nextjs-auth0";

const LogoutButton = () => {
  const { user } = useUser();

  return (
    user && (
      <button onClick={() => (window.location.href = "/api/auth/logout")}>
        Log Out
      </button>
    )
  );
};

export default LogoutButton;
