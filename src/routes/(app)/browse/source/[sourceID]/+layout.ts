import { source } from '$lib/generated';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	const sause = source({ variables: { id: params.sourceID } });
	// if this was ssr this would probably be bad, but its not so its fine :)

	return { ...params, sause };
};
