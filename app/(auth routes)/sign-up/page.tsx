"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import styles from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const user = await register({ email, password });
      setUser(user);
      router.push("/profile");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };
  return (
    <main className={styles.mainContent}>
      <h1 className={styles.formTitle}>Sign up</h1>
      <form className={styles.form} action={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </main>
  );
}
