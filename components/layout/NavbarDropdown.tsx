"use client";

import { logout } from "@/server/actions/auth";
import styles from "@/styles/navbar.module.css";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import UserSettings from "../protected/dialogs/UserSettings";

interface PropsType {
  children: ReactNode;
}

export default function NavbarDropdown({ children }: PropsType) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    else document.removeEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <div
      className={styles.dropdownContainer}
      onClick={() => setDropdownOpen((prev) => !prev)}
    >
      {children}
      {dropdownOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <button onClick={() => setSettingsOpen(true)}>
            <Settings /> Settings
          </button>
          <button onClick={() => logout().then(router.refresh)}>
            <LogOut /> Logout
          </button>
        </div>
      )}
      {settingsOpen && <UserSettings setOpen={setSettingsOpen} />}
    </div>
  );
}
