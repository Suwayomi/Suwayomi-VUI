// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { fetchSourceManga } from '$lib/gql/Mutations';
import type { VariablesOf } from '$lib/gql/graphql';

export const filtersState = $state<{
	filters: VariablesOf<typeof fetchSourceManga>['filters'];
	filtersSause: string;
}>({
	filters: [],
	filtersSause: ''
});
