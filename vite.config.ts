import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  // 백엔드 CORS가 http://localhost:5173만 허용하므로 다른 포트로 바뀌지 않게 고정한다.
  server: { port: 5173, strictPort: true },
});
