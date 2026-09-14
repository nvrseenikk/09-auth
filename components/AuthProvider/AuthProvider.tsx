"use client";
import React, { use, useEffect, useState } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await checkSession();
        if (session) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setIsChecked(true);
      }
    };
    checkAuth();
  }, [setUser, clearIsAuthenticated]);

  if (!isChecked) {
    return null;
  }
  return <>{children}</>;
}
