import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [
    // Cloudflare Workers plugin — must come before TanStack/React plugins
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    // TanStack Start file-based routing + SSR
    TanStackRouterVite({ autoCodeSplitting: true }),
    // React fast-refresh
    react(),
    // Tailwind CSS v4
    tailwindcss(),
    // TypeScript path aliases (@/...)
    tsConfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Prevent duplicate React / router instances
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-start",
    ],
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
});
