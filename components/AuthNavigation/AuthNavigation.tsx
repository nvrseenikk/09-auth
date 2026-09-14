"use client";

import Link from "next/link";
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
          <Link href="/profile" className={styles.navigationLink}>
            Profile
          </Link>
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
        <Link href="/sign-in" className={styles.navigationLink}>
          Login
        </Link>
      </li>
      <li className={styles.navigationItem}>
        <Link href="/sign-up" className={styles.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
