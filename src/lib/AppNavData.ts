// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export const AppNavData = [
	{
		href: '/',
		title: 'Library',
		icon: 'mdi:bookmark-box-multiple',
		match: (page: string) => {
			return page === '/';
		}
	},
	{
		href: '/updates',
		title: 'Updates',
		icon: 'mdi:alert-decagram-outline',
		match: (page: string) => {
			return page.includes('/updates');
		}
	},
	{
		href: '/browse/sources',
		title: 'Browse',
		icon: 'mdi:compass-outline',
		match: (page: string) => {
			return page.includes('/browse');
		}
	},
	{
		href: '/downloads',
		title: 'Downloads',
		icon: 'mdi:download',
		match: (page: string) => {
			return page.includes('/downloads');
		}
	},
	{
		href: '/settings',
		title: 'Settings',
		icon: 'mdi:cog',
		match: (page: string) => {
			return page.includes('/settings');
		}
	}
];
