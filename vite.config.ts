import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

// @ts-ignore
export default defineConfig(({ mode }) => {
	process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
	return {
		// @ts-ignore
		plugins: [sveltekit(), purgeCss()],
		server: {
			proxy: {
				'/api': {
					target: process.env.suwayomi,
					changeOrigin: true,
					ws: true
				}
			}
		},
		optimizeDeps: {
			exclude: ['@urql/svelte']
		}
	};
});
