import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { preset } from './src/lib/presets';
import { screens } from './src/lib/screens';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(
			require.resolve('@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {
			aspectRatio: {
				cover: '210 / 297'
			},
			width: {
				'1/7': 'calc(100% / 7)',
				'1/8': '12.5%',
				'1/12': 'calc(100% / 12)',
				'1/16': 'calc(100% / 16)',
				'1/18': 'calc(100% / 18)'
			},
			maxWidth: {
				'4/5': '80%',
				'1/3': 'calc(100% / 3)'
			},
			screens,
			borderRadius: {
				olg: '0.47rem'
			}
		}
	},
	plugins: [
		plugin(function ({ addVariant }) {
			Object.entries(screens).forEach((e) => {
				addVariant(`h-${e[0]}`, `@media (min-height: ${e[1]})`);
			});
		}),
		forms,
		typography,
		skeleton({
			themes: {
				preset
			}
		})
	]
} satisfies Config;
