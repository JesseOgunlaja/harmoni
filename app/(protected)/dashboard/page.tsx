import { Suspense } from "react";
import Dashboard from "@/components/protected/Dashboard";

export default function Page() {
	return (
		<Suspense fallback={null}>
			<Dashboard />
		</Suspense>
	);
}
