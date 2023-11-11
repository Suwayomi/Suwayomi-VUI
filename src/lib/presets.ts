import type { PresetThemeConfig } from '@skeletonlabs/tw-plugin';

export const presetConst = [
	{
		name: 'skeleton',
		enhancements: true
	},
	{
		name: 'wintry',
		enhancements: true
	},
	{
		name: 'modern',
		enhancements: true
	},
	{
		name: 'hamlindigo',
		enhancements: true
	},
	{
		name: 'rocket',
		enhancements: true
	},
	{
		name: 'sahara',
		enhancements: true
	},
	{
		name: 'gold-nouveau',
		enhancements: true
	},
	{
		name: 'vintage',
		enhancements: true
	},
	{
		name: 'seafoam',
		enhancements: true
	},
	{
		name: 'crimson',
		enhancements: true
	}
] as const;

export const preset = presetConst as unknown as PresetThemeConfig[];

export const presetWithIcons = presetConst.map((element) => {
	let icon = '';
	switch (element.name) {
		case 'skeleton':
			icon = '💀';
			break;
		case 'wintry':
			icon = '🌨️';
			break;
		case 'modern':
			icon = '🤖';
			break;
		case 'rocket':
			icon = '🚀';
			break;
		case 'seafoam':
			icon = '🧜‍♀️';
			break;
		case 'vintage':
			icon = '📺';
			break;
		case 'sahara':
			icon = '🏜️';
			break;
		case 'hamlindigo':
			icon = '👔';
			break;
		case 'gold-nouveau':
			icon = '💫';
			break;
		default:
			icon = '⭕';
			break;
	}
	return {
		name: element.name,
		icon
	};
});
