// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { graphql } from './graphql';

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

export const webUIUpdateStatusChange = graphql(`
	subscription webUIUpdateStatusChange {
		webUIUpdateStatusChange {
			info {
				channel
				tag
			}
			state
			progress
		}
	}
`);

export const updateStatusChanged = graphql(`
	subscription updateStatusChanged {
		updateStatusChanged {
			isRunning
			failedJobs {
				mangas {
					totalCount
					nodes {
						id
						title
						thumbnailUrl
					}
				}
			}
			completeJobs {
				mangas {
					totalCount
					nodes {
						id
						title
						thumbnailUrl
					}
				}
			}
			pendingJobs {
				mangas {
					totalCount
					nodes {
						id
						title
						thumbnailUrl
					}
				}
			}
			runningJobs {
				mangas {
					totalCount
					nodes {
						id
						title
						thumbnailUrl
					}
				}
			}
		}
	}
`);

export const DownloadChanged = graphql(`
	subscription MySubscription {
		downloadStatusChanged(input: {}) {
			initial {
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
				position
			}
			state
			updates {
				type
				download {
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
					position
				}
			}
		}
	}
`);
