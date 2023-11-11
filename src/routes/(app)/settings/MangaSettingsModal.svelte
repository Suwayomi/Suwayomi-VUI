<script lang="ts">
	import { RadioGroup, RadioItem, SlideToggle, getModalStore } from '@skeletonlabs/skeleton';
	import { ChapterSort, ChapterTitle, Meta } from '$lib/simpleStores';
	import { enumKeys } from '$lib/util';
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen">
		<h1 class="h3 pt-4 pl-4">Reader Defaults</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				<h2 class="h4 border-b border-surface-700 mb-1">Filters</h2>
				<TriStateSlide
					bind:state={$Meta.mangaMetaDefaults.ChapterUnread}
					label={'Unread'}
					class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
					labelclass="w-full"
				>
					<span>Unread</span>
				</TriStateSlide>
				<TriStateSlide
					bind:state={$Meta.mangaMetaDefaults.ChapterDownloaded}
					label={'Downloaded'}
					class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
					labelclass="w-full"
				>
					<span>Downloaded</span>
				</TriStateSlide>
				<TriStateSlide
					bind:state={$Meta.mangaMetaDefaults.ChapterBookmarked}
					label={'Downloaded'}
					class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
					labelclass="w-full"
				>
					<span>Bookmarked</span>
				</TriStateSlide>
				<h2 class="h4 border-b border-surface-700 mb-1">Sort</h2>
				<TriStateSlide
					tristat={false}
					bind:checked={$Meta.mangaMetaDefaults.ChapterAsc}
					label={'Ascending'}
					class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
					labelclass="w-full"
				>
					<span>Ascending</span>
				</TriStateSlide>
				<RadioGroup
					rounded="rounded-container-token"
					background="bg-transparent"
					class="focus:outline-0"
					border="border-0"
					display="flex-col"
					active="variant-glass-primary"
				>
					{#each enumKeys(ChapterSort) as value}
						<RadioItem
							bind:group={$Meta.mangaMetaDefaults.ChapterSort}
							class="focus:outline-0"
							name="justify"
							{value}
						>
							{value}
						</RadioItem>
					{/each}
				</RadioGroup>
				<h2 class="h4 border-b border-surface-700 mb-1">Display</h2>
				<button
					class="w-full focus:outline-0 p-1 pl-2 flex justify-between hover:variant-glass-surface rounded-full items-center"
					on:click|preventDefault|stopPropagation={() =>
						($Meta.mangaMetaDefaults.ChapterFetchUpload =
							!$Meta.mangaMetaDefaults.ChapterFetchUpload)}
				>
					<span>FetchDate/UploadDate</span>
					<SlideToggle
						name="slide"
						class="focus:outline-0"
						bind:checked={$Meta.mangaMetaDefaults.ChapterFetchUpload}
					/>
				</button>
				<RadioGroup
					rounded="rounded-container-token"
					background="bg-transparent"
					class="focus:outline-0"
					border="border-0"
					display="flex-col"
					active="variant-glass-primary"
				>
					{#each enumKeys(ChapterTitle) as value}
						<RadioItem
							bind:group={$Meta.mangaMetaDefaults.ChapterTitle}
							class="focus:outline-0"
							name="justify"
							{value}
						>
							{value}
						</RadioItem>
					{/each}
				</RadioGroup>
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
