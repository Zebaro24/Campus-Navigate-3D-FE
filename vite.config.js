import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        allowedHosts: ['campus.zebaro.dev'],
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/admin': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/media': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/static': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/images': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        }
    },
});
