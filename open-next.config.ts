import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
	...defineCloudflareConfig({}),
	// `npm run build` runs the OpenNext Cloudflare build; this is the plain Next.js build it wraps
	// (without it the two would call each other forever).
	buildCommand: "next build",
};
