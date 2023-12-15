import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import path from 'node:path';
import { createRequire } from 'node:module';
import { viteStaticCopy } from 'vite-plugin-static-copy';


const require = createRequire(import.meta.url);
const cMapsDir = path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps');
const standardFontsDir = path.join(
  path.dirname(require.resolve('pdfjs-dist/package.json')),
  'standard_fonts',
);

export default defineConfig({
    plugins: [
        svgr(),
        react(),
        viteStaticCopy({
            targets: [
                { src: cMapsDir, dest: '' },
                { src: standardFontsDir, dest: '' },
            ],
        }),
    ],
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
