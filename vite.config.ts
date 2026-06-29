import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

// @ts-ignore
export default defineConfig(({ mode }) => {
	process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
	console.log(process.env);
	return {
		// @ts-ignore
		plugins: [sveltekit(), purgeCss()],
		server: {
			proxy: {
				'/api': {
					target: process.env.suwayomi,
					changeOrigin: true,
					ws: true,
					configure: (_proxy, options) => {
						const username = process.env.username;
						const password = process.env.password;
						if (username && password) {
							options.auth = `${username}:${password}`;
						}
					}
				}
			},
			port: 5172
		},
		optimizeDeps: {
			exclude: ['@urql/svelte']
		}
	};
});
