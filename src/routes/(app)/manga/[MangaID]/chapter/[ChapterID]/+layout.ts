import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	const MangaID = parseInt(params.MangaID);
	const ChapterID = parseInt(params.ChapterID);
	if (isNaN(MangaID)) throw error(400, 'MangaID should be a number');
	if (isNaN(ChapterID)) throw error(400, 'MangaID should be a number');
	return {
		MangaID,
		ChapterID
	};
};
