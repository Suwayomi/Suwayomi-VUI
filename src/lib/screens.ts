// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export type Screens<T> = {
	xs: T;
	sm: T;
	md: T;
	lg: T;
	xl: T;
	'2xl': T;
	'3xl': T;
};
export const screens = {
	xs: '320px',
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px',
	'3xl': '2000px'
};
