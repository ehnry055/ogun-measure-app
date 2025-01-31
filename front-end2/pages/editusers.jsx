"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "../styles/EditDatabasePage.module.css";

export default function EditUsers() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/unauthorized");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="edit-database-container">
      <div className="saved-section">
        <h2 className="section-title">Registered Users</h2>
        <ul className="saved-users">
          <li>Jason Chae: jascha25@bergen.org</li>
          <li>Henry Choi: hencho25@bergen.org</li>
          <li>Stephen Yoon: steyoo25@bergen.org</li>
        </ul>
      </div>
      <div>
        <h2>This is where user editing will occur</h2>
      </div>
    </div>
  );
}