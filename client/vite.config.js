import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import os from "os";

const internalIP = os.networkInterfaces().Ethernet[1].address;

export default defineConfig({
     plugins: [react()],
     server: {
          port: 3000,
          open: "/",
          host: internalIP
     }
})