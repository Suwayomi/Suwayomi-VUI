<!-- 
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	let value = '';

	function doSearch() {}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl rounded-lg max-h-screen">
		<h1 class="h3 py-4 pl-4">Tracking settings</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				<!-- {#if $Meta.mangaUpdatesTracking?.enabled}
					<div class="pl-4">
						<label class="pl-3 mb-2">
							<span>Search</span>
							<input type="text" on:change={doSearch} bind:value class="input" />
						</label>
						<div class="px-4 pb-4">
							<!-- {#if $searchItems.loading}
								Loading...
							{:else if $searchItems.error}
								{JSON.stringify($searchItems.error)}
							{:else if $searchItems.data}
								{#each $searchItems.data.results as value}
									<a
										href={value.record.url}
										class="flex p-1 w-full hover:variant-ghost text-left"
										on:click={(e) => {
											if (e.ctrlKey) return;
											e.preventDefault();
											trackAs(value.record.series_id);
										}}
									>
										<div class="max-w-1/3 pr-1 flex-shrink-0">
											<Image
												src={value.record.image.url.thumb}
												alt={sanitizeHtml(value.record.title)}
												width="w-auto"
												height="h-auto"
												class="rounded-lg"
											/>
										</div>
										<div class="w-auto space-y-2">
											<h2 class="h5 md:h4 lg:h3 xl:h2 line-clamp-1">
												<span title={sanitizeHtml(value.record.title)}>
													<!-- eslint-disable-next-line svelte/no-at-html-tags -/->
													{@html sanitizeHtml(value.record.title)}
												</span>
											</h2>
											<h3 class="text-sm xl:text-base flex items-center space-x-2">
												<span class=" line-clamp-3" title={sanitizeHtml(value.record.description)}>
													<!-- eslint-disable-next-line svelte/no-at-html-tags -/->
													{@html sanitizeHtml(value.record.description)}
												</span>
											</h3>
										</div>
									</a>
								{/each}
							{/if} -\->
						</div>
					</div>
				{:else}
					<div>
						you need to setup tracking credentials in <a
							class="anchor"
							on:click={() => {
								modalStore.trigger({
									type: 'component',
									component: { ref: TrackingModal }
								});
								parent.onClose();
							}}
							href="/settings"
						>
							settings
						</a>
					</div>
				{/if} -->
			</div>
		</div>
		<!-- {#if currentTracking && $Meta.mangaUpdatesTracking?.enabled}
			{#await currentTracking}
				<h2 class="p-4">Loading...</h2>
			{:then track}
				<a href={track.url} target="_blank" class="block hover:variant-ghost-surface">
					<h2 class="pl-4 pt-4">Currently tracking:</h2>
					<div class="flex pl-4 pb-1 w-full text-left">
						<div class="max-w-1/3 pr-1 flex-shrink-0">
							<Image
								src={track.image.url.thumb}
								alt={sanitizeHtml(track.title)}
								width="w-auto"
								height="h-auto"
								class="rounded-lg"
							/>
						</div>
						<div class="w-auto space-y-2">
							<h2 class="h5 md:h4 lg:h3 xl:h2 line-clamp-1">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -\->
								<span title={sanitizeHtml(track.title)}>{@html sanitizeHtml(track.title)}</span>
							</h2>
							<h3 class="text-sm xl:text-base flex items-center space-x-2">
								<span class=" line-clamp-3" title={sanitizeHtml(track.description)}>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -\->
									{@html sanitizeHtml(track.description)}
								</span>
							</h3>
						</div>
					</div>
				</a>
			{/await}
		{:else}
			<h2 class="p-4">Currently not tracking</h2>
		{/if} -->
	</div>
{/if}
