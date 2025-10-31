import Link from "next/link";
import { Suspense } from "react";
import styles from "@/styles/navbar.module.css";
import AuthNavbarItem from "./AuthNavbarItem";

export default async function Navbar() {
	return (
		<nav id={styles.nav}>
			<ul>
				<li id={styles.title}>
					<Link href="/">harmoni</Link>
				</li>
				<Suspense fallback={null}>
					<AuthNavbarItem />
				</Suspense>
			</ul>
		</nav>
	);
}
