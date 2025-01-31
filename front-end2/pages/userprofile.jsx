"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Profile from "../components/profile";
import "../styles/HomePage.module.css";

export default function Users() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/unauthorized"); 
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div>User profile picture should show up, not working on Firefox :/</div>
      <Profile />
    </div>
  );
}
