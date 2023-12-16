// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ApolloClient, InMemoryCache, split, type ApolloLink } from '@apollo/client/core';
import { createUploadLink } from 'apollo-upload-client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

let splitLink: ApolloLink = createUploadLink({ uri: '/api/graphql' }) as unknown as ApolloLink;

try {
	const url = window.location.origin.replace(/^http/, 'ws') + '/api/graphql';
	const wsLink = new GraphQLWsLink(
		createClient({
			url
		})
	);
	splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
		},
		wsLink,
		splitLink
	);
} catch (error) {
	console.error(error);
}

export const cache = new InMemoryCache();

const client = new ApolloClient({
	cache,
	assumeImmutableResults: true,
	link: splitLink
});

export default client;
