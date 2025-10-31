import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	async rewrites() {
		return [
			{
				source: "/home",
				destination: "/",
			},
		];
	},
};

export default nextConfig;
