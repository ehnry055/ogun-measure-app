"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../styles/EditDatabasePage.module.css"; 
import NotesList from "../components/NotesList";

export default function EditDatabasePage() {
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
    <div className={styles.editDatabaseContainer}>
      <div className={styles.dataSection}>
        <h2 className={styles.sectionTitle}>Your Data</h2>
        <div className={styles.dataItem}>
          <h3>Aggregated Data</h3>
          <p>Items compiled and merged into a unique table</p>
          <div className={styles.actionButtons}>
            <button className={styles.deleteButton}>Delete</button>
            <button className={styles.editButton}>Edit</button>
          </div>
        </div>
        <div className={styles.notesList}>
          <NotesList />
        </div>
      </div>

      <div className={styles.dataSection}>
        <h2 className={styles.sectionTitle}>Saved Graphs</h2>
        <div className={styles.savedGraph}>
          <div className={styles.pieChart}></div>
          <h3>Pie Chart: AZ vs NJ</h3>
          <p>Saved on 1/2/23</p>
          <div className={styles.actionButtons}>
            <button className={styles.deleteButton}>Download</button>
            <button className={styles.editButton}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}