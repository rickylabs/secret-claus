/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
//import {withHydrationOverlay} from "@builder.io/react-hydration-overlay/next";

await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
