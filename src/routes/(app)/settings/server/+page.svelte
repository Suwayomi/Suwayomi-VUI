<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { actionState } from '$lib/MountTitleAction.svelte';
	import {
		GetEnumArray,
		errortoast,
		queryState,
		setSettings,
		subscriptionState
	} from '$lib/util.svelte';
	import { getContextClient } from '@urql/svelte';
	import Select from './components/Select.svelte';
	import ExtensionReposModal from './components/extensionReposModal.svelte';
	import Number from './components/number.svelte';
	import Text from './components/text.svelte';
	import Toggle from './components/toggle.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { categoryMangaNotInLibrary, serverSettings } from '$lib/gql/Queries';
	import {
		updateWebUI,
		type setServerSettings,
		runUpdateLibraryManga,
		updateMangasCategories
	} from '$lib/gql/Mutations';
	import { type VariablesOf } from '$lib/gql/graphql';
	import {
		updateStatusChanged,
		webUIUpdateStatusChange
	} from '$lib/gql/Subscriptions';
	import UpdateStatusInfoModal from './components/updateStatusInfoModal.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	const modalStore = getModalStore();

	actionState.AppBarData('Server Settings');
	const client = getContextClient();
	const settingsData = queryState({
		client,
		query: serverSettings
	});

	const webUIChannels = GetEnumArray('WebUIChannel');

	const webUIFlavors = GetEnumArray('WebUIFlavor');

	const webUIInterfaces = GetEnumArray('WebUIInterface');

	const webuiUpdateStatus = subscriptionState({
		client,
		query: webUIUpdateStatusChange
	});

	let autoDownloadNewChapters = $state(true);
	let autoDownloadIgnoreReUploads = $state(false);
	let autoDownloadNewChaptersLimit = $state(0);
	let backupInterval = $state(1);
	let backupPath = $state('');
	let backupTTL = $state(183);
	let backupTime = $state('00 =00');
	let basicAuthEnabled = $state(false);
	let basicAuthPassword = $state('');
	let basicAuthUsername = $state('');
	let debugLogsEnabled = $state(true);
	let downloadAsCbz = $state(true);
	let downloadsPath = $state('');
	let electronPath = $state('');
	let excludeCompleted = $state(true);
	let excludeEntryWithUnreadChapters = $state(false);
	let excludeNotStarted = $state(false);
	let extensionRepos = $state([] as string[]);
	let excludeUnreadChapters = $state(false);
	let flareSolverrEnabled = $state(true);
	let flareSolverrSessionName = $state('suwayomi');
	let flareSolverrSessionTtl = $state(15);
	let flareSolverrTimeout = $state(60);
	let flareSolverrUrl = $state('');
	let globalUpdateInterval = $state(6);
	// let gqlDebugLogsEnabled = $state(false);
	let initialOpenInBrowserEnabled = $state(false);
	let ip = $state('0.0.0.0');
	let localSourcePath = $state('');
	let maxSourcesInParallel = $state(4);
	let port = $state(4567);
	let socksProxyEnabled = $state(false);
	let socksProxyHost = $state('');
	let socksProxyPort = $state('');
	let socksProxyPassword = $state('');
	let socksProxyUsername = $state('');
	let socksProxyVersion = $state(5);
	let systemTrayEnabled = $state(false);
	let updateMangas = $state(false);
	let webUIChannel = $state(
		'STABLE' as NonNullable<
			NonNullable<
				VariablesOf<typeof setServerSettings>['settings']
			>['webUIChannel']
		>
	);
	let webUIFlavor = $state(
		'WEBUI' as NonNullable<
			NonNullable<
				VariablesOf<typeof setServerSettings>['settings']
			>['webUIFlavor']
		>
	);
	let webUIInterface = $state(
		'BROWSER' as NonNullable<
			NonNullable<
				VariablesOf<typeof setServerSettings>['settings']
			>['webUIInterface']
		>
	);
	let webUIUpdateCheckInterval = $state(23);

	$effect(() => {
		if (settingsData.data?.settings) {
			autoDownloadNewChapters =
				settingsData.data.settings.autoDownloadNewChapters;
			autoDownloadIgnoreReUploads = settingsData.data.settings
				.autoDownloadIgnoreReUploads as boolean;
			autoDownloadNewChaptersLimit =
				settingsData.data.settings.autoDownloadNewChaptersLimit;
			backupInterval = settingsData.data.settings.backupInterval;
			backupPath = settingsData.data.settings.backupPath;
			backupTTL = settingsData.data.settings.backupTTL;
			backupTime = settingsData.data.settings.backupTime;
			basicAuthEnabled = settingsData.data.settings.basicAuthEnabled;
			basicAuthPassword = settingsData.data.settings.basicAuthPassword;
			basicAuthUsername = settingsData.data.settings.basicAuthUsername;
			debugLogsEnabled = settingsData.data.settings.debugLogsEnabled;
			downloadAsCbz = settingsData.data.settings.downloadAsCbz;
			downloadsPath = settingsData.data.settings.downloadsPath;
			electronPath = settingsData.data.settings.electronPath;
			excludeCompleted = settingsData.data.settings.excludeCompleted;
			excludeEntryWithUnreadChapters =
				settingsData.data.settings.excludeEntryWithUnreadChapters;
			excludeNotStarted = settingsData.data.settings.excludeNotStarted;
			extensionRepos = settingsData.data.settings.extensionRepos;
			excludeUnreadChapters = settingsData.data.settings.excludeUnreadChapters;
			flareSolverrEnabled = settingsData.data.settings.flareSolverrEnabled;
			flareSolverrSessionName =
				settingsData.data.settings.flareSolverrSessionName;
			flareSolverrSessionTtl =
				settingsData.data.settings.flareSolverrSessionTtl;
			flareSolverrTimeout = settingsData.data.settings.flareSolverrTimeout;
			flareSolverrUrl = settingsData.data.settings.flareSolverrUrl;
			globalUpdateInterval = settingsData.data.settings.globalUpdateInterval;
			// gqlDebugLogsEnabled =
			// 	settingsData.data.settings.gqlDebugLogsEnabled;
			initialOpenInBrowserEnabled =
				settingsData.data.settings.initialOpenInBrowserEnabled;
			ip = settingsData.data.settings.ip;
			localSourcePath = settingsData.data.settings.localSourcePath;
			maxSourcesInParallel = settingsData.data.settings.maxSourcesInParallel;
			port = settingsData.data.settings.port;
			socksProxyEnabled = settingsData.data.settings.socksProxyEnabled;
			socksProxyHost = settingsData.data.settings.socksProxyHost;
			socksProxyPort = settingsData.data.settings.socksProxyPort;
			socksProxyPassword = settingsData.data.settings.socksProxyPassword;
			socksProxyUsername = settingsData.data.settings.socksProxyUsername;
			socksProxyVersion = settingsData.data.settings.socksProxyVersion;
			systemTrayEnabled = settingsData.data.settings.systemTrayEnabled;
			updateMangas = settingsData.data.settings.updateMangas;
			webUIChannel = settingsData.data.settings.webUIChannel;
			webUIFlavor = settingsData.data.settings.webUIFlavor;
			webUIInterface = settingsData.data.settings.webUIInterface;
			webUIUpdateCheckInterval =
				settingsData.data.settings.webUIUpdateCheckInterval;
		}
	});

	let update = subscriptionState({
		client,
		query: updateStatusChanged
	});

	function manuallyLibraryRunUpdate() {
		if (!update.data?.updateStatusChanged.isRunning) {
			client.mutation(runUpdateLibraryManga, {}).toPromise();
		}
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: {
				ref: UpdateStatusInfoModal,
				props: { update }
			}
		});
	}
	function globalUpdateInfo() {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: {
				ref: UpdateStatusInfoModal,
				props: { update }
			}
		});
	}

	let removingNoCategoriesManga = $state(false);

	async function removeCategoryFromMangaNotInLibrary() {
		removingNoCategoriesManga = true;
		const MangasWithCategory = await client
			.query(categoryMangaNotInLibrary, {}, { requestPolicy: 'network-only' })
			.toPromise();

		if (MangasWithCategory.data?.mangas.nodes?.length) {
			await client
				.mutation(updateMangasCategories, {
					id: MangasWithCategory.data.mangas.nodes.map((manga) => manga.id),
					addTo: [],
					clear: true
				})
				.toPromise();
		}

		removingNoCategoriesManga = false;
	}
</script>

{#if settingsData.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify(settingsData.error, null, 4)}
	</div>
{:else if settingsData.fetching}
	Loading...
{:else if settingsData.data}
	{@const settings = settingsData.data.settings}
	<div class="[&>*]:px-4">
		<!-- remove category from Manga Not In Library -->
		<button
			class="flex h-16 w-full cursor-pointer items-center justify-between text-left hover:variant-glass-surface"
			onclick={removeCategoryFromMangaNotInLibrary}
		>
			<div>
				Clear database
				<div class="text-sm opacity-50">
					Remove non library mangas from categories
				</div>
			</div>
			{#if removingNoCategoriesManga}
				<IconWrapper
					name="mdi:autorenew"
					class="aspect-square h-full w-auto animate-spin"
				/>
			{/if}
		</button>

		<!-- autoDownloadNewChapters -->
		<Toggle
			title="Auto Download New Chapters"
			bind:checked={autoDownloadNewChapters}
			onchange={() => setSettings({ autoDownloadNewChapters })}
		/>
		<!-- autoDownloadIgnoreReUploads -->
		<Toggle
			title="Auto Download Ignore Re-Uploads"
			bind:checked={autoDownloadIgnoreReUploads}
			onchange={() => setSettings({ autoDownloadIgnoreReUploads })}
		/>
		<!-- autoDownloadNewChaptersLimit -->
		<Number
			title="Auto Download New Chapters Limit"
			bind:value={autoDownloadNewChaptersLimit}
			max={999}
			onchange={() => setSettings({ autoDownloadNewChaptersLimit })}
		/>
		<!-- backupInterval -->
		<Number
			title="Backup Interval (in days)"
			bind:value={backupInterval}
			max={14}
			onchange={() => setSettings({ backupInterval })}
		/>
		<!-- backupPath -->
		<Text
			title="Backup Path"
			bind:value={backupPath}
			onchange={() => setSettings({ backupPath })}
		/>
		<!-- backupTTL -->
		<Number
			title="Backup TTL (in days)"
			value={backupTTL}
			max={365}
			onchange={() => setSettings({ backupTTL })}
		/>
		<!-- backupTime -->
		<Text
			title="Backup Time"
			bind:value={backupTime}
			onchange={() => {
				if (/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(backupTime)) {
					setSettings({ backupTime });
					return;
				}
				errortoast(
					'Time validation failed',
					'Backup Time must be in format HH:MM'
				);
				backupTime = settings.backupTime;
			}}
		/>
		<!-- basicAuthEnabled -->
		<Toggle
			title="Basic Auth"
			bind:checked={basicAuthEnabled}
			onchange={() => setSettings({ basicAuthEnabled })}
		/>
		<!-- basicAuthPassword -->
		<Text
			title="Basic Auth Password"
			bind:value={basicAuthPassword}
			onchange={() => setSettings({ basicAuthPassword })}
			type="password"
		/>
		<!-- basicAuthUsername -->
		<Text
			title="Basic Auth Username"
			bind:value={basicAuthUsername}
			onchange={() => setSettings({ basicAuthUsername })}
		/>
		<!-- debugLogsEnabled -->
		<Toggle
			title="Debug Logs"
			bind:checked={debugLogsEnabled}
			onchange={() => setSettings({ debugLogsEnabled })}
		/>
		<!-- downloadAsCbz -->
		<Toggle
			title="Download as CBZ"
			bind:checked={downloadAsCbz}
			onchange={() => setSettings({ downloadAsCbz })}
		/>
		<!-- downloadsPath -->
		<Text
			title="Downloads Path"
			bind:value={downloadsPath}
			onchange={() => setSettings({ downloadsPath })}
		/>
		<!-- electronPath -->
		<Text
			title="Electron Path"
			bind:value={electronPath}
			onchange={() => setSettings({ electronPath })}
		/>
		<!-- excludeCompleted -->
		<Toggle
			title="Exclude Completed"
			bind:checked={excludeCompleted}
			onchange={() => setSettings({ excludeCompleted })}
		/>
		<!-- excludeEntryWithUnreadChapters -->
		<Toggle
			title="Exclude Entry With Unread Chapters"
			bind:checked={excludeEntryWithUnreadChapters}
			onchange={() => setSettings({ excludeEntryWithUnreadChapters })}
		/>
		<!-- excludeNotStarted -->
		<Toggle
			title="Exclude Not Started"
			bind:checked={excludeNotStarted}
			onchange={() => setSettings({ excludeNotStarted })}
		/>
		<!-- extensionRepos -->
		<button
			class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
			onclick={() => {
				modalStore.trigger({
					type: 'component',
					backdropClasses: '!p-0',
					component: {
						ref: ExtensionReposModal,
						props: { repos: extensionRepos }
					}
				});
			}}
		>
			Extension Repos
		</button>
		<!-- excludeUnreadChapters -->
		<Toggle
			title="Exclude Unread Chapters"
			bind:checked={excludeUnreadChapters}
			onchange={() => setSettings({ excludeUnreadChapters })}
		/>
		<!-- flareSolverrEnabled -->
		<Toggle
			title="Flare Solverr"
			bind:checked={flareSolverrEnabled}
			onchange={() => setSettings({ flareSolverrEnabled })}
		/>
		<!-- flareSolverrSessionName -->
		<Text
			title="Flare Solverr Session Name"
			bind:value={flareSolverrSessionName}
			onchange={() => setSettings({ flareSolverrSessionName })}
		/>
		<!-- flareSolverrSessionTtl -->
		<Number
			title="Flare Solverr Session Ttl"
			value={flareSolverrSessionTtl}
			max={365}
			onchange={() => setSettings({ flareSolverrSessionTtl })}
		/>
		<!-- flareSolverrTimeout -->
		<Number
			title="Flare Solverr Timeout"
			value={flareSolverrTimeout}
			max={365}
			onchange={() => setSettings({ flareSolverrTimeout })}
		/>
		<!-- flareSolverrUrl -->
		<Text
			title="Flare Solverr Url"
			bind:value={flareSolverrUrl}
			onchange={() => setSettings({ flareSolverrUrl })}
		/>
		<!-- globalUpdateInterval -->
		<Number
			title="Global Update Interval (in hours)"
			value={globalUpdateInterval}
			max={365}
			onchange={() => setSettings({ globalUpdateInterval })}
		/>
		<!-- manually run global update -->
		<button
			class="flex h-16 w-full items-center justify-between text-left
			{update.data?.updateStatusChanged.isRunning
				? ''
				: 'cursor-pointer hover:variant-glass-surface'}"
			onclick={manuallyLibraryRunUpdate}
			title={!update.data?.updateStatusChanged.isRunning
				? 'click to run Global update now'
				: 'click below to see more info in the currently running update'}
			disabled={update.data?.updateStatusChanged.isRunning}
		>
			Run Global Update now
			<IconWrapper
				name="mdi:autorenew"
				class="aspect-square h-5/6 w-auto
				{update.data?.updateStatusChanged.isRunning ? 'animate-spin' : ''}"
			/>
		</button>
		<!-- Global update info -->
		<button
			class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
			onclick={globalUpdateInfo}
		>
			Global update info
		</button>

		<!-- gqlDebugLogsEnabled -->
		<!-- <Toggle
			title="GQL Debug Logs"
			bind:checked={gqlDebugLogsEnabled}
			onchange={() => setSettings({ gqlDebugLogsEnabled })}
		/> -->
		<!-- initialOpenInBrowserEnabled -->
		<Toggle
			title="Initial Open In Browser"
			bind:checked={initialOpenInBrowserEnabled}
			onchange={() => setSettings({ initialOpenInBrowserEnabled })}
		/>
		<!-- ip -->
		<Text
			title="IP"
			bind:value={ip}
			onchange={() => {
				if (/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) {
					setSettings({ ip });
					return;
				}
				errortoast(
					'Time validation failed',
					'Backup Time must be in format HH:MM'
				);
				ip = settings.ip;
			}}
		/>
		<!-- localSourcePath -->
		<Text
			title="Local Source Path"
			bind:value={localSourcePath}
			onchange={() => setSettings({ localSourcePath })}
		/>
		<!-- maxSourcesInParallel -->
		<Number
			title="Max Sources In Parallel"
			value={maxSourcesInParallel}
			max={10}
			onchange={() => setSettings({ maxSourcesInParallel })}
		/>
		<!-- port -->
		<Number
			title="Port"
			value={port}
			max={65535}
			onchange={() => {
				if (port < 65535 && port > 0) {
					setSettings({ port });
					return;
				}
				errortoast(
					'Port validation failed',
					'Port must be between 0 and 65535'
				);
				port = settings.port;
			}}
		/>
		<!-- socksProxyEnabled -->
		<Toggle
			title="Socks Proxy"
			bind:checked={socksProxyEnabled}
			onchange={() => setSettings({ socksProxyEnabled })}
		/>
		<!-- socksProxyHost -->
		<Text
			title="Socks Proxy Host"
			bind:value={socksProxyHost}
			onchange={() => setSettings({ socksProxyHost })}
		/>
		<!-- socksProxyPort -->
		<Text
			title="Socks Proxy Port"
			bind:value={socksProxyPort}
			onchange={() => {
				const int = parseInt(socksProxyPort);
				if (!isNaN(int) && int < 65535 && int > 0) {
					setSettings({ socksProxyPort });
					return;
				}
				errortoast(
					'socksProxyPort validation failed',
					'socksProxyPort must be a number between 0 and 65535'
				);
				socksProxyPort = settings.socksProxyPort;
			}}
		/>
		<!-- socksProxyPassword -->
		<Text
			title="Socks Proxy Password"
			bind:value={socksProxyPassword}
			onchange={() => setSettings({ socksProxyPassword })}
		/>
		<!-- socksProxyUsername -->
		<Text
			title="Socks Proxy Username"
			bind:value={socksProxyUsername}
			onchange={() => setSettings({ socksProxyUsername })}
		/>
		<!-- socksProxyVersion -->
		<Number
			title="Socks Proxy Version"
			value={socksProxyVersion}
			max={3}
			onchange={() => setSettings({ socksProxyVersion })}
		/>
		<!-- systemTrayEnabled -->
		<Toggle
			title="System Tray"
			bind:checked={systemTrayEnabled}
			onchange={() => setSettings({ systemTrayEnabled })}
		/>
		<!-- updateMangas -->
		<Toggle
			title="Update Mangas"
			bind:checked={updateMangas}
			onchange={() => setSettings({ updateMangas })}
		/>
		<!-- webUIChannel -->
		<Select
			title="Web UI Channel"
			bind:value={webUIChannel}
			options={webUIChannels}
			onchange={() => setSettings({ webUIChannel })}
		/>
		<!-- webUIFlavor -->
		<Select
			title="Web UI Flavor"
			bind:value={webUIFlavor}
			options={webUIFlavors}
			onchange={() => setSettings({ webUIFlavor })}
		/>
		<!-- webUIInterface -->
		<Select
			title="Web UI Interface"
			bind:value={webUIInterface}
			options={webUIInterfaces}
			onchange={() => setSettings({ webUIInterface })}
		/>
		<!-- webUIUpdateCheckInterval -->
		<Number
			title="Web UI Update Check Interval (in hours)"
			value={webUIUpdateCheckInterval}
			max={100}
			onchange={() => setSettings({ webUIUpdateCheckInterval })}
		/>
		<!-- UpdateWebUI -->
		<button
			class="h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
			onclick={() => {
				client.mutation(updateWebUI, {}).toPromise();
			}}
		>
			UpdateWebUI
			<div class="text-sm opacity-50">
				{#if webuiUpdateStatus.data}
					{webuiUpdateStatus.data.webUIUpdateStatusChange.state} | {webuiUpdateStatus
						.data.webUIUpdateStatusChange.progress}% | {webuiUpdateStatus.data
						.webUIUpdateStatusChange.info.channel} | {webuiUpdateStatus.data
						.webUIUpdateStatusChange.info.tag}
				{/if}
			</div>
		</button>
	</div>
{/if}
