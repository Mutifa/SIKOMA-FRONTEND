import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	build: {
		// Optimasi bundle size
		chunkSizeWarningLimit: 1000,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
			},
		},
		// Code splitting untuk lazy loading
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor': ['react', 'react-dom', 'react-router-dom'],
					'bootstrap': ['bootstrap'],
					'api': ['axios'],
				},
			},
		},
	},
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


