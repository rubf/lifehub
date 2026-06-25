import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `base` is read from an environment variable so the same config works both
// for local development / Vercel / Netlify (served at "/") and for GitHub
// Pages project sites (served under "/<repo>/"). The deploy workflow sets it.
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
});
