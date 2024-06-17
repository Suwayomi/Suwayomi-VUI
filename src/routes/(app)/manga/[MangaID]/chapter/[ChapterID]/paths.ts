// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
export const paths = {
	rtl: {
		L: {
			back: [
				[33, 33],
				[33, 0],
				[100, 0],
				[100, 66],
				[66, 66],
				[66, 33]
			],
			forward: [
				[0, 0],
				[33, 0],
				[33, 66],
				[100, 66],
				[100, 100],
				[0, 100]
			],
			menu: [
				[33, 33],
				[66, 33],
				[66, 66],
				[33, 66]
			]
		},
		RAL: {
			back: [
				[66, 0],
				[100, 0],
				[100, 100],
				[66, 100]
			],
			forward: [
				[0, 0],
				[33, 0],
				[33, 100],
				[0, 100]
			],
			menu: [
				[33, 0],
				[66, 0],
				[66, 100],
				[33, 100]
			]
		},
		Kindle: {
			back: [
				[66, 33],
				[66, 100],
				[100, 100],
				[100, 33]
			],
			forward: [
				[66, 33],
				[66, 100],
				[0, 100],
				[0, 33]
			],
			menu: [
				[0, 0],
				[100, 0],
				[100, 33],
				[0, 33]
			]
		},
		Edge: {
			back: [
				[33, 66],
				[66, 66],
				[66, 100],
				[33, 100]
			],
			forward: [
				[100, 0],
				[100, 100],
				[0, 100],
				[0, 0],
				[33, 0],
				[33, 100],
				[66, 100],
				[66, 0]
			],
			menu: [
				[33, 66],
				[66, 66],
				[66, 0],
				[33, 0]
			]
		}
	},
	ltr: {
		L: {
			forward: [
				[100, 100],
				[100, 0],
				[66, 0],
				[66, 66],
				[0, 66],
				[0, 100]
			],
			back: [
				[33, 33],
				[66, 33],
				[66, 0],
				[0, 0],
				[0, 66],
				[33, 66]
			],
			menu: [
				[33, 33],
				[66, 33],
				[66, 66],
				[33, 66]
			]
		},
		RAL: {
			forward: [
				[66, 0],
				[100, 0],
				[100, 100],
				[66, 100]
			],
			back: [
				[0, 0],
				[33, 0],
				[33, 100],
				[0, 100]
			],
			menu: [
				[33, 0],
				[66, 0],
				[66, 100],
				[33, 100]
			]
		},
		Kindle: {
			forward: [
				[33, 33],
				[33, 100],
				[100, 100],
				[100, 33]
			],
			back: [
				[33, 33],
				[33, 100],
				[0, 100],
				[0, 33]
			],
			menu: [
				[0, 0],
				[100, 0],
				[100, 33],
				[0, 33]
			]
		},
		Edge: {
			forward: [
				[100, 0],
				[100, 100],
				[0, 100],
				[0, 0],
				[33, 0],
				[33, 100],
				[66, 100],
				[66, 0]
			],
			back: [
				[33, 66],
				[66, 66],
				[66, 100],
				[33, 100]
			],
			menu: [
				[33, 66],
				[66, 66],
				[66, 0],
				[33, 0]
			]
		}
	}
} as const;

type tmp = keyof typeof paths;
export type PathLayout = (typeof paths)[tmp];
export type Paths = (typeof paths)[tmp][keyof PathLayout];
export type TPath = (typeof paths)[tmp][keyof PathLayout][keyof Paths];
