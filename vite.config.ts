import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// @ts-ignore
export default defineConfig({
	// @ts-ignore
	plugins: [sveltekit(), purgeCss()],
	server: {
		proxy: {
			'/api': {
				target: process.env.VITE_URL,
				changeOrigin: true,
				ws: true
			}
		}
	}
});
