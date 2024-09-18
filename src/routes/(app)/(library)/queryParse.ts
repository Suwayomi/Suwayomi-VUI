// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

type and = {
	type: 'and';
	value: string;
	base: string;
};

type not = {
	type: 'not';
	value: string;
	base: string;
};

type or = {
	type: 'or';
	value: (and | not | or)[];
};

export type ANO = and | not | or;

export type parsedQueryType = ANO[] | null;

type err = string;

export function parseQuery(
	query: string | null
): [null, parsedQueryType] | [err, null] {
	if (!query) {
		return [null, null];
	}
	const titleAndSpecific = query.split('@');
	if (titleAndSpecific.length === 1) {
		return [null, [parseAnd('title:' + titleAndSpecific[0])]];
	}
	if (titleAndSpecific.length > 2) {
		return ["Too many ' @ '", null];
	}
	titleAndSpecific[1] = `title:${titleAndSpecific[0]} ${titleAndSpecific[1]}`;

	const specifics = titleAndSpecific[1].split(' ').filter((e) => e.length > 0);
	const openbrackets = [...titleAndSpecific[1]].filter((e) => e === '{');
	const closebrackets = [...titleAndSpecific[1]].filter((e) => e === '}');
	if (openbrackets.length !== closebrackets.length) {
		return ["Mismatched '{' and '}'", null];
	}

	const [err, jsn] = specificToJson(specifics.join(' '));
	if (err !== null) {
		return [err, null];
	}
	const tmp = jsn.map(parseRecursaveStringArray);

	return [null, tmp];
}

type recursaveStringArray = (string | recursaveStringArray)[];

function specificToJson(
	string: string
): [null, recursaveStringArray] | [err, null] {
	string = string
		.replace(/\{/g, '[')
		.replace(/\}\s/g, '], ')
		.replace(/\}/g, ']')
		.replace(/\s+/, ', ');
	string = '[' + string + ']';
	string = string.replace(/[^[\],\s]+/g, '"$&"').replace(/" /g, '", ');
	try {
		return [null, JSON.parse(string)];
	} catch (error) {
		if (error instanceof Error) {
			return [error.message, null];
		}
		throw error;
	}
}

function parseRecursaveStringArray(
	query: string | recursaveStringArray
): and | not | or {
	if (typeof query === 'string') {
		return parseAndNot(query);
	}
	return parseOr(query);
}

function parseOr(query: recursaveStringArray): or {
	const tmp = query.map(parseRecursaveStringArray);
	return { type: 'or', value: tmp };
}

function parseAndNot(query: string): and | not {
	query = query.replaceAll(/[{}]/g, '');
	if (query.startsWith('-')) {
		return parseNot(query);
	}
	return parseAnd(query);
}

function parseAnd(query: string): and {
	const tmp = parseBase(query);
	return { type: 'and', ...tmp };
}

function parseNot(query: string): not {
	query = query.substring(1);
	const tmp = parseBase(query);
	return { type: 'not', ...tmp };
}

function parseBase(query: string): { base: string; value: string } {
	if (query === '|') {
		return { base: query, value: query };
	}
	const tmp = query.split(':');
	if (tmp.length !== 2) {
		return { base: '', value: query };
	}
	return { base: tmp[0], value: tmp[1] };
}
