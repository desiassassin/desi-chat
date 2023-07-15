import { defineConfig, loadEnv, css } from "vite";
import react from "@vitejs/plugin-react";
import { networkInterfaces } from "node:os";

export default defineConfig(({ command, mode }) => {
     const env = loadEnv(mode, process.cwd(), "");

     if (env.MODE === "development") {
          const internalIP = networkInterfaces().Ethernet[1].address;

          return {
               plugins: [react()],
               server: {
                    port: 3000,
                    open: "/",
                    host: internalIP
               },
               css: {
                    preprocessorOptions: {
                         scss: {}
                    }
               }
          };
     }

     return {
          plugins: [react()],
          server: {
               port: 3000,
               open: "/",
               host: "localhost"
          },
          css: {
               preprocessorOptions: {
                    scss: {}
               }
          }
     };
});
