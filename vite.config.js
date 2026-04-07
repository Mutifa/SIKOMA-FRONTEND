import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		strictPort: true,
		proxy: {
			  '/api': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: false,
				cookieDomainRewrite: 'localhost',
			},
			'/csrf-cookie': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/csrf-cookie/, '/api/csrf-cookie'),
			},
			'/debug-auth': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/debug-auth/, '/api/debug-auth'),
			},
			'/uploads': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: false,
		
			},
		}
	}
})


