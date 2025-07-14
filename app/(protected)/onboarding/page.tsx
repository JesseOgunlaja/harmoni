import OnboardingComponent from "@/components/protected/OnboardingForm";
import { db } from "@/server/db/db";
import { users } from "@/server/db/schema";
import styles from "@/styles/onboarding.module.css";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export default async function Page() {
  const userId = (await headers()).get("userId");
  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(userId)),
  });

  return (
    <main id={styles.main}>
      <h1>Welcome to harmoni</h1>
      <OnboardingComponent name={user!.name} />
    </main>
  );
}
