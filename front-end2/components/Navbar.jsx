"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import LoginButton from "./login";
import LogoutButton from "./logout";
import styles from "../styles/Navbar.module.css";
import columbiaLogo from "../assets/columbia-logo.png"; 

export default function Navbar() {
  const { user, error, isLoading } = useUser();

  return (
    <div className={styles.topNavbar}>
      <div className={styles.navbarLeft}>
        <Image src={columbiaLogo} alt="Logo" className={styles.logo} width={50} height={50} />
        <span className={styles.title}>Placeholder</span>
        <span className={styles.subtitle}>Racism Data System</span>
      </div>

      <div className={styles.navbarCenter}>
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>🏠 Home</Link>
          <Link href="/editusers" className={styles.navLink}>👤 Users</Link>
          <Link href="/editdatabase" className={styles.navLink}>📁 Data</Link>
          <Link href="/datapage" className={styles.navLink}>📊 Graphs</Link>
        </nav>
      </div>

      <div className={styles.navbarRight}>
        <input type="text" className={styles.searchBar} placeholder="Search..." />
        <div className={styles.tba}>
          {error && <p>Authentication Error</p>}
          {isLoading && <p>Loading...</p>}
          
          {!error && !isLoading && (
            user ? <LogoutButton /> : <LoginButton />
          )}
        </div>
      </div>
    </div>
  );
}
