import { promiseToast } from "@/lib/lib";
import { emailSchema } from "@/lib/schema";
import { addMember } from "@/server/actions/projects";
import { FormEvent, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { useRole } from "../wrappers/RoleProvider";
import ProjectRolesTable from "./ProjectRolesTable";

export default function ManageUsers() {
  const role = useRole()!;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!emailSchema.safeParse(email).success) {
      return toast.error("Invalid email");
    }

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        addMember(role.project.id, email).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: () => {
          setEmail("");
          setLoading(false);
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  return (
    <div>
      <ProjectRolesTable />
      {(role.role === "owner" || role.role === "admin") && (
        <form onSubmit={formSubmit}>
          <label htmlFor="manage-users">Add member</label>
          <input
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            id="manage-users"
            type="text"
            placeholder="john.doe@gmail.com"
          />
          <button disabled={loading} type="submit">
            Add member
          </button>
        </form>
      )}
    </div>
  );
}
