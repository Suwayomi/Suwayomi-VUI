import { error } from '@sveltejs/kit';
import type { PageLoad } from '../$types';

export const load: PageLoad = ({ params }) => {
	const tmp = parseInt(params.MangaID);
	if (isNaN(tmp)) throw error(400, 'MangaID should be a number');
	return {
		MangaID: tmp
	};
};
