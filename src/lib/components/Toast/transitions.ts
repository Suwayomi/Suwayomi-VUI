// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { TransitionConfig } from 'svelte/transition';

// Transitions ---
export function dynamicTransition<T extends Transition>(
	node: Element,
	dynParams: DynamicTransitionParams<T>
): TransitionConfig {
	const { transition, params, enabled } = dynParams;

	if (enabled) return transition(node, params);

	// it's better to just set the `duration` to 0 to prevent flickering
	if ('duration' in params) return transition(node, { duration: 0 });

	// if the transition doesn't provide a `duration` prop, then we'll just return this as a last resort
	return { duration: 0 };
}

type DynamicTransitionParams<T extends Transition> = {
	transition: T;
	params: TransitionParams<T>;
	enabled: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transition = (node: Element, params?: any) => TransitionConfig;
export type TransitionParams<T extends Transition> = Parameters<T>[1];
