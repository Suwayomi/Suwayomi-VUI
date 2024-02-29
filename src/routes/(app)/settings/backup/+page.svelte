<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { ErrorHelp } from '$lib/util';
	import {
		FileDropzone,
		ProgressBar,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { getToastStore } from '$lib/components/Toast/stores';
	import { AppBarData } from '$lib/MountTitleAction';
	import {
		getContextClient,
		queryStore,
		type OperationResultStore,
		type Pausable
	} from '@urql/svelte';
	import { createBackup, restoreBackup } from '$lib/gql/Mutations';
	import { restoreStatus, validateBackup } from '$lib/gql/Queries';
	import type { ResultOf } from 'gql.tada';
	const toastStore = getToastStore();
	const modalStore = getModalStore();
	let MakingBackup = false;
	const client = getContextClient();
	async function MakeBacup() {
		if (MakingBackup) return;
		MakingBackup = true;
		await ErrorHelp(
			'failed to create backup',
			client.mutation(createBackup, {}).toPromise(),
			(e) => {
				if (e?.data) window.location.href = e.data.createBackup.url;
			}
		);
		MakingBackup = false;
	}
	AppBarData('Backup');
	let files: FileList;
	async function validateRestore() {
		await ErrorHelp(
			'failed to validate backup file',
			client.query(validateBackup, { backup: files[0] }).toPromise(),
			(e) => {
				if (e.data?.validateBackup.missingSources.length) {
					toastStore.trigger({
						hoverable: true,
						message: `
        <h3>you are missing sources to restore</h3>
        <p title='${e.data?.validateBackup.missingSources
					.map((ele) => ele.id)
					.join(',')}'>
${e.data?.validateBackup.missingSources.map((ele) => ele.name).join(',')}
				</p>
        `,
						action: {
							label: 'Force restore',
							response: restore
						},
						actionClass: 'btn variant-filled-error',
						background: 'variant-filled-warning'
					});
					return;
				}
				restore();
			}
		);
	}

	type RestoreStatus =
		| (OperationResultStore<ResultOf<typeof restoreStatus>> & Pausable)
		| undefined;

	let restoreStat: RestoreStatus;

	$: if ($restoreStat?.data?.restoreStatus?.state === 'SUCCESS') {
		toastStore.trigger({
			hoverable: true,
			message: `<h3>you successfully restored the backup</h3>`,
			background: 'variant-filled-success'
		});
		restoreStat = undefined;
	}

	$: if ($restoreStat?.data?.restoreStatus?.state === 'FAILURE') {
		toastStore.trigger({
			hoverable: true,
			message: `<h3>The backup failed to restore</h3>`,
			background: 'variant-filled-error'
		});
		restoreStat = undefined;
	}

	function restore() {
		ErrorHelp(
			'failed to start restoring backup',
			client.mutation(restoreBackup, { backup: files[0] }).toPromise(),
			(e) => {
				if (e.data?.restoreBackup.id) {
					restoreStat = queryStore({
						client,
						query: restoreStatus,
						variables: { id: e.data.restoreBackup.id },
						requestPolicy: 'cache-only'
					});
					const clear = setInterval(() => {
						if (!e.data?.restoreBackup.id) {
							clearInterval(clear);
							return;
						}
						client
							.query(
								restoreStatus,
								{ id: e.data.restoreBackup.id },
								{ requestPolicy: 'network-only' }
							)
							.toPromise()
							.then((e) => {
								if (e.data?.restoreStatus?.state === 'SUCCESS') {
									clearInterval(clear);
								}
							});
					}, 1000);
				}
			}
		);
	}
</script>

{#if $modalStore[0]}
	<div class="w-full">
		<button
			class="block h-[76px] text-left w-full hover:variant-glass-surface px-4 py-2"
			on:click={MakeBacup}
		>
			<div class="text-xl">Create backup</div>
			<div class="opacity-80">
				<span class="flex-none">Back up library as a Tachiyomi backup</span>
			</div>
			{#if MakingBackup}
				<ProgressBar />
			{/if}
		</button>
	</div>
	<div class="w-full card">
		<FileDropzone
			on:change={validateRestore}
			accept=".proto.gz"
			name="files"
			bind:files
			padding="p-[14px]"
		>
			<div slot="message">
				<div>Restore backup</div>
				<div>Upload a file or drag and drop</div>
			</div>
		</FileDropzone>
		{#if $restoreStat?.data?.restoreStatus?.state}
			<div
				class="p-4"
				title="{$restoreStat.data.restoreStatus.state
					.toLowerCase()
					.replaceAll('_', ' ')}&#013;{$restoreStat.data.restoreStatus
					.mangaProgress}/{$restoreStat.data.restoreStatus.totalManga}"
			>
				<ProgressBar
					value={$restoreStat.data.restoreStatus.mangaProgress}
					max={$restoreStat.data.restoreStatus.totalManga}
				/>
			</div>
		{/if}
	</div>
{/if}
