// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { graphql } from './graphql';

export const downloadChanged = graphql(`
	subscription downloadChanged {
		downloadChanged {
			queue {
				chapter {
					name
					id
				}
				manga {
					title
					thumbnailUrl
					id
				}
				progress
				state
				tries
			}
			state
		}
	}
`);

export const downloadsOnChapters = graphql(`
	subscription downloadsOnChapters {
		downloadChanged {
			queue {
				progress
				state
				chapter {
					id
				}
				manga {
					id
				}
			}
			state
		}
	}
`);
