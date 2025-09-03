import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";

// Plugin to generate blog index automatically
const blogIndexPlugin = () => {
  return {
    name: "blog-index-generator",
    buildStart() {
      try {
        execSync("node scripts/generate-blog-index.js", { stdio: "inherit" });
      } catch (error) {
        console.warn("Failed to generate blog index:", error.message);
      }
    },
  };
};

export default defineConfig({
  plugins: [react(), blogIndexPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    target: "es2015",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          prism: ["prismjs"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
