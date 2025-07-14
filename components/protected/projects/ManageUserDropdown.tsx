"use client";

import { promiseToast } from "@/lib/lib";
import {
  changeMemberRole,
  removeMemberFromProject,
} from "@/server/actions/projects";
import { Role } from "@/server/db/schema";
import { Crown, Ellipsis, Eye, Shield, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRole } from "../wrappers/RoleProvider";

interface PropsType {
  role: Role;
  projectId: number;
}

export default function ManageUserDropdown({ role, projectId }: PropsType) {
  const userRole = useRole()!;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const hasPermission =
    (userRole.role === "owner" || userRole.role === "admin") &&
    role.role !== "owner" &&
    role.userId !== userRole?.userId;

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }

    function handleClick(e: MouseEvent) {
      if (
        !dropdownRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) document.addEventListener("mousedown", handleClick);
    else document.removeEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  function changeRole(e: ReactMouseEvent, newRole: Role["role"]) {
    if (loading) return;
    setLoading(true);

    promiseToast(
      new Promise((resolve, reject) => {
        changeMemberRole(role.userId, projectId, newRole).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: async () => {
          setLoading(false);
          setShowDropdown(false);
          router.refresh();
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  function removeMember() {
    if (loading) return;
    setLoading(true);

    promiseToast(
      new Promise((resolve, reject) => {
        removeMemberFromProject(role.userId, projectId).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: async () => {
          setLoading(false);
          setShowDropdown(false);
          router.refresh();
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setShowDropdown((prev) => !prev)}
        disabled={!hasPermission || loading}
      >
        <Ellipsis />
      </button>
      {showDropdown &&
        createPortal(
          <div
            id="dropdown"
            ref={dropdownRef}
            style={{
              ...position,
              display: position.top === 0 ? "none" : "flex",
              transform: "translateX(-90%)",
            }}
          >
            {userRole.role === "owner" && (
              <button onClick={(e) => changeRole(e, "owner")}>
                <Crown /> Promote to Owner
              </button>
            )}
            {role.role !== "admin" && (
              <button onClick={(e) => changeRole(e, "admin")}>
                <Shield /> Promote to Admin
              </button>
            )}
            {role.role !== "regular" && (
              <button onClick={(e) => changeRole(e, "regular")}>
                <User /> Change to Regular
              </button>
            )}
            {role.role !== "read_only" && (
              <button onClick={(e) => changeRole(e, "read_only")}>
                <Eye /> Change to Viewer
              </button>
            )}
            <button onClick={removeMember}>
              <Trash2 /> Remove user from project
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
