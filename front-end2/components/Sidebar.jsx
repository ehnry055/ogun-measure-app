"use client";

import styles from '../styles/Sidebar.module.css'; 
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <nav>
        <Link href="#" className={styles.sidebarLink}>User Type</Link>
        <Link href="/userprofile" className={styles.sidebarLink}>Profile</Link>
        <Link href="#" className={styles.sidebarLink}>Settings</Link>
        <Link href="#" className={styles.sidebarLink}>Log Out</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
