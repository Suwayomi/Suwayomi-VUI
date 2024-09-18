<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
</script>

<ModalTemplate title="Library Specific Search Help">
	<p class="whitespace-pre-wrap">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<h2>Basic Info:</h2>specific search is based on the style of searching that booru sites often support

regular title search and specific search is separated by an "@"

specific search does not respect Escape Characters.
you can't use "@" in search at all
you cant use "{", "}", "_" or ":" in the specific search

you must replace " " with "_" in the specific search
so "space monster" would be "space_monster"
it will still search for "space monster" 

<h2>Searching:</h2>
@ title:isekai title:life
title contains both isekai and life

@ -title:isekai
title does not contain isekai

@ {title:isekai title:life | title:space}
title contains either isekai AND life, OR space

<h2>Metatags:</h2>
title:isekai 
sorthand t:isekai
search for manga with isekai in the title

description:space
sorthand d:space
search for manga with space in the description

genre:action
sorthand g:action
search for manga with action in the genres 
this can be a partial match so "actio" would also work

artist:Kwon
sorthand a:Kwon
search for manga with Kwon in the artist name

author:Ingijagga
sorthand au:Ingijagga
search for manga with Ingijagga in the author name

source:mangadex
sorthand s:mangadex
search for manga with mangadex in the source name

status:completed
sorthand st:completed
search for manga with completed in the status
`}
	</p>
</ModalTemplate>
