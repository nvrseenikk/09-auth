"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { logout } from "../../lib/api/clientApi";
import styles from "./AuthNavigation.module.css";



export default function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.push("/sign-in");
  };

  if (isAuthenticated) {
    return (
      <>
        <li className={styles.navigationItem}>
          <a href="/profile" className={styles.navigationLink}>
            Profile
          </a>
        </li>
        <li className={styles.navigationItem}>
          <p className={styles.userEmail}>{user?.email}</p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }
  return (
    <>
      <li className={styles.navigationItem}>
        <a href="/sign-in" className={styles.navigationLink}>
          Login
        </a>
      </li>
      <li className={styles.navigationItem}>
        <a href="/sign-up" className={styles.navigationLink}>
          Sign up
        </a>
      </li>
    </>
  );
}