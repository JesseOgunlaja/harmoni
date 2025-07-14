import styles from "@/styles/dialog/projectDisplay.module.css";
import { Ellipsis, PenLine, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface PropsType {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  deleteButtonClick: () => void;
  canEdit: boolean;
}

export default function ManageCommentDropdown({
  setIsEditing,
  deleteButtonClick,
  canEdit,
}: PropsType) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
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

  return (
    <>
      <button ref={buttonRef} onClick={() => setShowDropdown((prev) => !prev)}>
        <Ellipsis />
      </button>
      {showDropdown && (
        <div ref={dropdownRef} id="dropdown" className={styles.dropdown}>
          {canEdit && (
            <button
              onClick={() => {
                setIsEditing(true);
                setShowDropdown(false);
              }}
            >
              <PenLine /> Edit comment
            </button>
          )}
          <button onClick={deleteButtonClick}>
            <Trash2 /> Delete comment
          </button>
        </div>
      )}
    </>
  );
}
