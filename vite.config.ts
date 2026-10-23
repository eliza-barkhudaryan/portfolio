import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
    },
    publicDir: 'public',
    server: {
        proxy: {
            '/storage': {
                target: 'https://storage.elizabarkhudaryan.me',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/storage/, ''),
            },
        },
    },
});

