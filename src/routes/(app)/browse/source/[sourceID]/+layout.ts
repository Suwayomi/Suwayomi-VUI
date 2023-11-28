// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { source } from '$lib/generated';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	const sause = source({ variables: { id: params.sourceID } });
	// if this was ssr this would probably be bad, but its not so its fine :)

	return { ...params, sause };
};
