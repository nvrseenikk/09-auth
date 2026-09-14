import type { Metadata } from "next";
import Image from "next/image";
import { getMe } from "../../../lib/api/serverApi";
import styles from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "View your NoteHub profile information.",
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={styles.mainContent}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h1 className={styles.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={styles.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={styles.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={styles.avatar}
          />
        </div>

        <div className={styles.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
