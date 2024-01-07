import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// @ts-expect-error Type 'Promise<Plugin<any>[]>' is not assignable to type 'PluginOption'
	plugins: [sveltekit(), purgeCss()],
	server: {
		proxy: {
			'/api': {
				target: process.env.VITE_URL,
				changeOrigin: true,
				ws: true
			},
			'/v1': {
				target: 'https://api.mangaupdates.com',
				changeOrigin: true
			}
		}
	}
});
