import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ["es2020"],
  },
  plugins: [reactRefresh()],
  define: {
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
      },
      plugins: [
        GlobalPolyFill({
          process: true,
          buffer: true,
        }),
      ],
    },
  },

  resolve: {
    
  },
});
