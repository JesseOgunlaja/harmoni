"use client";

import { promiseToast, validateWithSchema } from "@/lib/lib";
import { projectsSchema } from "@/lib/schema";
import { deleteProject, editProject } from "@/server/actions/projects";
import { Project } from "@/server/db/schema";
import styles from "@/styles/dialog/editProject.module.css";
import "@/styles/utils/dialog.css";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useReducer, useState } from "react";
import { createPortal } from "react-dom";
import ManageUsers from "../projects/ManageUsers";
import { useRole } from "../wrappers/RoleProvider";

interface PropsType {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface State {
  title: string;
  description: string;
  status: Project["status"];
}

type Action =
  | { key: "status"; value: Project["status"] }
  | { key: "title"; value: string }
  | { key: "description"; value: string };

function reducer(state: State, action: Action) {
  return {
    ...state,
    [action.key]: action.value,
  };
}

export default function EditProjectDialog({ setOpen }: PropsType) {
  const { project, role } = useRole()!;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isEditingUsers, setIsEditingUsers] = useState(false);
  const [{ title, status, description }, dispatch] = useReducer(
    reducer,
    project
  );

  function closeModal() {
    setLoading(false);
    setIsEditingUsers(false);
    setOpen(false);
  }

  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!validateWithSchema(projectsSchema, { title, description })) return;

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        editProject(project.id, title, description, status).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: () => {
          closeModal();
          router.refresh();
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  async function deleteButtonClick() {
    if (loading) return;

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        deleteProject(project.id).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: () => {
          closeModal();
          router.refresh();
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  return createPortal(
    <dialog
      id={styles.dialog}
      className={project.status}
      onClick={closeModal}
      open
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <p>Edit project</p>
          <button onClick={closeModal}>&times;</button>
        </div>
        {isEditingUsers ? (
          <ManageUsers />
        ) : (
          <form onSubmit={formSubmit}>
            <label htmlFor="edit-project-status">Status</label>
            <div>
              <select
                id="edit-project-status"
                onChange={(e) =>
                  dispatch({
                    key: "status",
                    value: e.target.value as Project["status"],
                  })
                }
                value={status}
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">In progress</option>
                <option value="complete">Completed</option>
              </select>
              <ChevronDown />
            </div>
            <label htmlFor="edit-project-title">Project Title</label>
            <input
              value={title}
              onChange={(e) =>
                dispatch({ key: "title", value: e.target.value })
              }
              autoComplete="off"
              type="text"
              id="edit-project-title"
            />
            <label htmlFor="edit-project-description">Description</label>
            <textarea
              value={description}
              onChange={(e) =>
                dispatch({ key: "description", value: e.target.value })
              }
              id="edit-project-description"
            ></textarea>
            {(role === "admin" || role === "owner") && (
              <button type="button" onClick={() => setIsEditingUsers(true)}>
                Manage users
              </button>
            )}
            <div>
              <button type="button" onClick={deleteButtonClick}>
                Delete project
              </button>
              <button onClick={closeModal} type="button">
                Cancel
              </button>
              <button type="submit">Edit Project</button>
            </div>
          </form>
        )}
      </div>
    </dialog>,
    document.body
  );
}
