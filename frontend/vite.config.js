import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,  // اختاري أي بورت تحبيه
    strictPort: false
  }
});

