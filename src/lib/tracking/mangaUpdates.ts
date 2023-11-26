import { get } from 'svelte/store';
import { Meta } from '../simpleStores';
import { dev } from '$app/environment';

type resp = {
	status: 'success' | 'exception';
	reason: string;
};

type Response<T> = resp & {
	context?: T;
};

type LoginSuccessContext = {
	session_token: string;
	uid: number;
};

export type SearchResult = {
	total_hits: number;
	page: number;
	per_page: number;
	results: {
		record: {
			series_id: number;
			title: string;
			url: string;
			description: string;
			image: {
				url: {
					original: string;
					thumb: string;
				};
				height: number;
				width: number;
			};
			type: string;
			year: string;
			bayesian_rating: number;
			rating_votes: number;
			genres: {
				genre: string;
			}[];
			last_updated: {
				timestamp: number;
				as_rfc3339: string;
				as_string: string;
			};
		};
		hit_title: string;
		metadata: {
			user_list: {
				list_type: null | string;
				list_icon: null | string;
				status: {
					volume: null | number;
					chapter: null | number;
				};
			};
			user_genre_highlights: unknown[];
		};
	}[];
};

type MangaStatusResponse = {
	series: {
		id: number;
		title: string;
	};
	list_id: number;
	status: {
		volume: number;
		chapter: number;
	};
	priority: number;
	time_added: {
		timestamp: number;
		as_rfc3339: string;
		as_string: string;
	};
};

type SeriesError = {
	errors: {
		error: string;
		series_id: number;
	}[];
};

export type GetMangaResponse = {
	series_id: number;
	title: string;
	url: string;
	associated: {
		title: string;
	}[];
	description: string;
	image: {
		url: {
			original: string;
			thumb: string;
		};
		height: number;
		width: number;
	};
	type: string;
	year: string;
	bayesian_rating: number;
	rating_votes: number;
	genres: {
		genre: string;
	}[];
	categories: {
		series_id: number;
		category: string;
		votes: number;
		votes_plus: number;
		votes_minus: number;
		added_by: number;
	}[];
	latest_chapter: number;
	forum_id: number;
	status: string;
	licensed: boolean;
	completed: boolean;
	anime: {
		start: string;
		end: string;
	};
	related_series: {
		relation_id: number;
		relation_type: string;
		related_series_id: number;
		related_series_name: string;
		triggered_by_relation_id: number;
	}[];
	authors: {
		name: string;
		author_id: number;
		type: string;
	}[];
	publishers: {
		publisher_name: string;
		publisher_id: number;
		type: string;
		notes: string;
	}[];
	publications: {
		publication_name: string;
		publisher_name: string;
		publisher_id: string;
	}[];
	recommendations: {
		series_name: string;
		series_id: number;
		weight: number;
	}[];
	category_recommendations: {
		series_name: string;
		series_id: number;
		weight: number;
	}[];
	rank: {
		position: {
			week: number;
			month: number;
			three_months: number;
			six_months: number;
			year: number;
		};
		old_position: {
			week: number;
			month: number;
			three_months: number;
			six_months: number;
			year: number;
		};
		lists: {
			reading: number;
			wish: number;
			complete: number;
			unfinished: number;
			custom: number;
		};
	};
	last_updated: {
		timestamp: number;
		as_rfc3339: string;
		as_string: string;
	};
	admin: {
		added_by: {
			user_id: number;
			username: string;
			url: string;
			avatar: {
				id: number;
				url: string;
				height: number;
				width: number;
			};
			time_joined: {
				timestamp: number;
				as_rfc3339: string;
				as_string: string;
			};
			signature: string;
			forum_title: string;
			folding_at_home: boolean;
			profile: {
				upgrade: {
					requested: boolean;
					reason: string;
				};
			};
			stats: {
				forum_posts: number;
				added_authors: number;
				added_groups: number;
				added_publishers: number;
				added_releases: number;
				added_series: number;
			};
			user_group: string;
			user_group_name: string;
		};
		approved: boolean;
	};
};

if (dev) {
	window.tracking = 'docker';
}

async function mangaUpdates() {
	let Authorization = '';
	Meta.subscribe((e) => {
		Authorization = e.mangaUpdatesTracking.Authorization;
	});
	const Met = get(Meta).mangaUpdatesTracking;

	if (Met.enabled && Met.password && Met.username && !Met.Authorization) {
		try {
			await login();
		} catch (error) {}
	}

	async function login() {
		const Met = get(Meta);
		const username = Met.mangaUpdatesTracking.username;
		const password = Met.mangaUpdatesTracking.password;
		const response = await fetch('/v1/account/login', {
			method: 'PUT',
			body: JSON.stringify({
				username,
				password
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data: Response<LoginSuccessContext> = await response.json();
		if (data.status === 'exception') {
			throw new Error(data.reason);
		}
		Meta.update((n) => {
			if (data.context) {
				n.mangaUpdatesTracking.Authorization = data.context.session_token;
			}
			return n;
		});
		if (data.context) {
			return 'Success';
		}
	}

	async function logout() {
		if (!Authorization) {
			throw new Error('No Auth provided');
		}
		const response = await fetch('/v1/account/logout', {
			method: 'POST',
			headers: {
				Authorization
			}
		});
		const data: resp = await response.json();
		if (data.status === 'exception') {
			throw new Error(data.reason);
		}
		return data;
	}

	async function search(search: string) {
		const response = await fetch('/v1/series/search', {
			method: 'POST',
			body: JSON.stringify({
				search
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization
			}
		});
		const data: resp | SearchResult = await response.json();
		if ('status' in data && data.status === 'exception') {
			throw new Error(data.reason);
		}
		return data;
	}

	async function mangaStatus(mangaID: number, retry = 1) {
		if (!Authorization) {
			throw new Error('No Auth provided');
		}
		const response = await fetch(`/v1/lists/series/${mangaID}`, {
			method: 'GET',
			headers: {
				Authorization
			}
		});
		if (response.status === 404) {
			throw new Error('Not In List');
		}
		if (response.status === 401) {
			if (retry) {
				await login();
				return mangaStatus(mangaID, retry - 1);
			}
			throw new Error('Auth failed');
		}
		const data: resp | MangaStatusResponse = await response.json();
		if ('status' in data && data.status === 'exception') {
			throw new Error(data.reason);
		}
		return data;
	}

	async function addMangaToList(id: number, chapter: number, retry = 1) {
		if (!Authorization) {
			throw new Error('No Auth provided');
		}
		const response = await fetch('/v1/lists/series', {
			method: 'POST',
			headers: {
				Authorization,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([
				{
					series: {
						id
					},
					list_id: 0,
					status: {
						chapter
					},
					priority: 0
				}
			])
		});
		if (response.status === 401) {
			if (retry) {
				await login();
				return addMangaToList(id, chapter, retry - 1);
			}
			throw new Error('Auth failed');
		}
		const data: Response<SeriesError> = await response.json();
		if ('status' in data && data.status === 'exception') {
			if (data.context) {
				data.context.errors.forEach((e) => console.error(e));
			}
			throw new Error(data.reason);
		}
		return data;
	}

	async function updateMangaListStatus(id: number, chapter: number, retry = 1) {
		if (!Authorization) {
			throw new Error('No Auth provided');
		}
		const response = await fetch('/v1/lists/series/update', {
			method: 'POST',
			headers: {
				Authorization,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([
				{
					series: {
						id
					},
					list_id: 0,
					status: {
						chapter
					},
					priority: 0
				}
			])
		});
		if (response.status === 401) {
			if (retry) {
				await login();
				return updateMangaListStatus(id, chapter, retry - 1);
			}
			throw new Error('Auth failed');
		}
		const data: Response<SeriesError> = await response.json();
		if ('status' in data && data.status === 'exception') {
			if (data.context) {
				data.context.errors.forEach((e) => console.error(e));
			}
			throw new Error(data.reason);
		}
		return data;
	}

	async function removeMangaFromList(id: number, retry = 1) {
		if (!Authorization) {
			throw new Error('No Auth provided');
		}
		const response = await fetch('/v1/lists/series/delete', {
			method: 'POST',
			headers: {
				Authorization,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([id])
		});
		if (response.status === 401) {
			if (retry) {
				await login();
				return removeMangaFromList(id, retry - 1);
			}
			throw new Error('Auth failed');
		}
		const data: Response<SeriesError> = await response.json();
		if ('status' in data && data.status === 'exception') {
			if (data.context) {
				data.context.errors.forEach((e) => console.error(e));
			}
			throw new Error(data.reason);
		}
		return data;
	}

	async function getManga(id: number) {
		const response = await fetch(`/v1/series/${id}`);
		if (response.status === 404) {
			throw new Error("manga doesn't exist");
		}
		const data: GetMangaResponse = await response.json();
		return data;
	}

	return {
		login,
		logout,
		search,
		mangaStatus,
		addMangaToList,
		updateMangaListStatus,
		removeMangaFromList,
		getManga
	};
}

export const MangaUpdates = mangaUpdates();
