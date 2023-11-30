// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Toast interface types

import type { CssClasses } from '@skeletonlabs/skeleton';

export type { ToastStore } from './stores.ts';

export interface ToastSettings {
	/** Provide the toast message. Supports HTML. */
	message: string;
	/** Provide CSS classes to set the background color. */
	background?: string;
	/** Enables auto-hide after the timeout duration. */
	autoHide?: boolean;
	/** Set the auto-hide timeout duration. */
	timeout?: number;
	/** Generate a custom action button UI. */
	action?: {
		/** The button label. Supports HTML. */
		label: string;
		/** The function triggered when the button is pressed. */
		response: () => void;
	};
	actionClass?: CssClasses;
	/** Hide dismiss button */
	hideDismiss?: boolean;
	/** Remain visible on Hover */
	hoverable?: boolean;
	/** Provide arbitrary CSS classes to style the toast. */
	classes?: string;
	/** Callback function that fires on trigger and close. */
	callback?: (response: { id: string; status: 'queued' | 'closed' }) => void;
}

export interface Toast extends ToastSettings {
	/** A UUID will be auto-assigned on `.trigger()`. */
	id: string;
	/** The id of the `setTimeout` if `autoHide` is enabled  */
	timeoutId?: ReturnType<typeof setTimeout>;
}
