// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { initGraphQLTada } from 'gql.tada';
import type { introspection } from '../../graphql-env';

export const graphql = initGraphQLTada<{
	introspection: introspection;
	scalars: {
		LongString: string;
	};
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
