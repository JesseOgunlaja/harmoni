import SignInForm from "@/components/auth/SignInForm";
import styles from "@/styles/signin.module.css";
import { LogIn } from "lucide-react";

export default function SignIn() {
  return (
    <main id={styles.main}>
      <div>
        <LogIn />
      </div>
      <SignInForm />
    </main>
  );
}
