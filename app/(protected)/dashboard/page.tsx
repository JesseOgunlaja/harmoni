import EmailChangeNotifier from "@/components/protected/EmailChangeNotifier";
import ProjectList from "@/components/protected/projects/ProjectList";
import DndProvider from "@/components/protected/wrappers/DndContext";
import UserProvider from "@/components/protected/wrappers/UserProvider";
import { getUserFromId } from "@/server/lib";
import styles from "@/styles/dashboard.module.css";
import { headers } from "next/headers";

export default async function Page() {
  const userId = (await headers()).get("userId");
  const user = await getUserFromId(Number(userId));

  return (
    <main id={styles.main}>
      <h1>Project Dashboard</h1>
      <EmailChangeNotifier />
      <div className={styles.projects}>
        <UserProvider user={user}>
          <DndProvider roles={user!.roles}>
            <ProjectList
              title="Scheduled"
              roles={user!.roles.filter(
                ({ project }) => project.status === "scheduled"
              )}
              status="scheduled"
            />
            <ProjectList
              title="In Progress"
              roles={user!.roles.filter(
                ({ project }) => project.status === "ongoing"
              )}
              status="ongoing"
            />
            <ProjectList
              title="Completed"
              roles={user!.roles.filter(
                ({ project }) => project.status === "complete"
              )}
              status="complete"
            />
          </DndProvider>
        </UserProvider>
      </div>
    </main>
  );
}
