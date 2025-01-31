"use client";
import { useUser } from "@auth0/nextjs-auth0";

const LoginButton = () => {
  const { user } = useUser();

  return (
    !user && (
      <button onClick={() => (window.location.href = "/api/auth/login")}>
        Log In
      </button>
    )
  );
};

export default LoginButton;