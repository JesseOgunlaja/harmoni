import { FullRole } from "@/server/db/schema";
import { MessageCircle } from "lucide-react";
import EditProjectButton from "./EditProjectButton";

interface PropsType {
  role: FullRole;
}

export default function Project({ role }: PropsType) {
  const { project, role: userRole } = role;

  return (
    <>
      <h3>
        {project.title} {userRole !== "read_only" && <EditProjectButton />}
      </h3>
      <p>{project.description}</p>
      <div>
        <span>
          <MessageCircle />
          {project.comments.length}
        </span>
        <span>{project.status.toUpperCase()}</span>
      </div>
    </>
  );
}
