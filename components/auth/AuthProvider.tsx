"use client";

import { refreshToken } from "@/server/actions/auth";
import { useEffect } from "react";

export default function AuthProvider() {
  useEffect(() => {
    (async () => await refreshToken())();
    setInterval(async () => {
      await refreshToken();
    }, 50000);
  }, []);
  return null;
}
