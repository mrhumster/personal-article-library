import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [svgr(),react()],
    resolve: {
        mainFields: [],
    },
    server: {
        host: true,
        port: 3000,
        watch: {
            usePolling: true
        }
    }
})
