"use cache";

import { LogIn } from "lucide-react";
import SignInForm from "@/components/auth/SignInForm";
import styles from "@/styles/signin.module.css";

export default async function SignIn() {
	return (
		<main id={styles.main}>
			<div>
				<LogIn />
			</div>
			<SignInForm />
		</main>
	);
}
