import styles from "@/styles/dialog/projectDisplay.module.css";
import "@/styles/utils/dialog.css";
import { createPortal } from "react-dom";
import ProjectComments from "../projects/ProjectComments";
import ProjectRolesTable from "../projects/ProjectRolesTable";
import { useRole } from "../wrappers/RoleProvider";

interface PropsType {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProjectDialog({ setOpen }: PropsType) {
  const role = useRole()!;
  function closeModal() {
    setOpen(false);
  }

  return createPortal(
    <dialog id={styles.dialog} onClick={closeModal} open>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>Project details</h2>
          <button onClick={closeModal}>&times;</button>
        </div>
        <h3>
          <span>Title:</span> {role.project.title}
        </h3>
        <p>
          <span>Description:</span> {role.project.description}
        </p>
        <p id={styles.userLabel}>Users</p>
        <ProjectRolesTable isEditing={false} />
        <ProjectComments />
      </div>
    </dialog>,
    document.body
  );
}
