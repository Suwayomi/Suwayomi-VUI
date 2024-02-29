<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { errortoast, setSettings } from '$lib/util';
	import { getContextClient, queryStore } from '@urql/svelte';
	import Select from './components/Select.svelte';
	import ExtensionReposModal from './components/extensionReposModal.svelte';
	import Number from './components/number.svelte';
	import Text from './components/text.svelte';
	import Toggle from './components/toggle.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { serverSettings } from '$lib/gql/Queries';
	import type { setServerSettings } from '$lib/gql/Mutations';
	import { graphql, type VariablesOf } from 'gql.tada';
	const modalStore = getModalStore();

	AppBarData('Server Settings');
	const client = getContextClient();
	const settingsData = queryStore({
		client,
		query: serverSettings
	});

	const chanels = queryStore({
		client,
		query: graphql(`
			{
				__type(name: "WebUIChannel") {
					enumValues {
						name
					}
				}
			}
		`)
	});

	const flavors = queryStore({
		client,
		query: graphql(`
			{
				__type(name: "WebUIFlavor") {
					enumValues {
						name
					}
				}
			}
		`)
	});

	const interfaces = queryStore({
		client,
		query: graphql(`
			{
				__type(name: "WebUIInterface") {
					enumValues {
						name
					}
				}
			}
		`)
	});

	$: webUIChannels =
		(
			$chanels.data?.__type as { enumValues: { name: string }[] | undefined }
		)?.enumValues!.map((x) => x.name) ?? []; //['BUNDLED', 'STABLE', 'PREVIEW'];
	$: webUIFlavors =
		(
			$flavors.data?.__type as { enumValues: { name: string }[] | undefined }
		)?.enumValues!.map((x) => x.name) ?? []; //['WEBUI', 'VUI', 'CUSTOM'];
	$: webUIInterfaces =
		(
			$interfaces.data?.__type as { enumValues: { name: string }[] | undefined }
		)?.enumValues!.map((x) => x.name) ?? []; //['BROWSER', 'ELECTRON'];

	let autoDownloadNewChapters = true;
	let backupInterval = 1;
	let backupPath = '';
	let backupTTL = 183;
	let backupTime = '00 =00';
	let basicAuthEnabled = false;
	let basicAuthPassword = '';
	let basicAuthUsername = '';
	let debugLogsEnabled = true;
	let downloadAsCbz = true;
	let downloadsPath = '';
	let electronPath = '';
	let excludeCompleted = true;
	let excludeEntryWithUnreadChapters = false;
	let excludeNotStarted = false;
	let extensionRepos = [] as string[];
	let excludeUnreadChapters = false;
	let flareSolverrEnabled = true;
	let flareSolverrSessionName = 'suwayomi';
	let flareSolverrSessionTtl = 15;
	let flareSolverrTimeout = 60;
	let flareSolverrUrl = '';
	let globalUpdateInterval = 6;
	let gqlDebugLogsEnabled = false;
	let initialOpenInBrowserEnabled = false;
	let ip = '0.0.0.0';
	let localSourcePath = '';
	let maxSourcesInParallel = 4;
	let port = 4567;
	let socksProxyEnabled = false;
	let socksProxyHost = '';
	let socksProxyPort = '';
	let systemTrayEnabled = false;
	let updateMangas = false;
	let webUIChannel = 'STABLE' as NonNullable<
		NonNullable<
			VariablesOf<typeof setServerSettings>['settings']
		>['webUIChannel']
	>;
	let webUIFlavor = 'WEBUI' as NonNullable<
		NonNullable<
			VariablesOf<typeof setServerSettings>['settings']
		>['webUIFlavor']
	>;
	let webUIInterface = 'BROWSER' as NonNullable<
		NonNullable<
			VariablesOf<typeof setServerSettings>['settings']
		>['webUIInterface']
	>;
	let webUIUpdateCheckInterval = 23;

	settingsData.subscribe((data) => {
		if (data.data?.settings) {
			autoDownloadNewChapters = data.data.settings.autoDownloadNewChapters;
			backupInterval = data.data.settings.backupInterval;
			backupPath = data.data.settings.backupPath;
			backupTTL = data.data.settings.backupTTL;
			backupTime = data.data.settings.backupTime;
			basicAuthEnabled = data.data.settings.basicAuthEnabled;
			basicAuthPassword = data.data.settings.basicAuthPassword;
			basicAuthUsername = data.data.settings.basicAuthUsername;
			debugLogsEnabled = data.data.settings.debugLogsEnabled;
			downloadAsCbz = data.data.settings.downloadAsCbz;
			downloadsPath = data.data.settings.downloadsPath;
			electronPath = data.data.settings.electronPath;
			excludeCompleted = data.data.settings.excludeCompleted;
			excludeEntryWithUnreadChapters =
				data.data.settings.excludeEntryWithUnreadChapters;
			excludeNotStarted = data.data.settings.excludeNotStarted;
			extensionRepos = data.data.settings.extensionRepos;
			excludeUnreadChapters = data.data.settings.excludeUnreadChapters;
			flareSolverrEnabled = data.data.settings.flareSolverrEnabled;
			flareSolverrSessionName = data.data.settings.flareSolverrSessionName;
			flareSolverrSessionTtl = data.data.settings.flareSolverrSessionTtl;
			flareSolverrTimeout = data.data.settings.flareSolverrTimeout;
			flareSolverrUrl = data.data.settings.flareSolverrUrl;
			globalUpdateInterval = data.data.settings.globalUpdateInterval;
			gqlDebugLogsEnabled = data.data.settings.gqlDebugLogsEnabled;
			initialOpenInBrowserEnabled =
				data.data.settings.initialOpenInBrowserEnabled;
			ip = data.data.settings.ip;
			localSourcePath = data.data.settings.localSourcePath;
			maxSourcesInParallel = data.data.settings.maxSourcesInParallel;
			port = data.data.settings.port;
			socksProxyEnabled = data.data.settings.socksProxyEnabled;
			socksProxyHost = data.data.settings.socksProxyHost;
			socksProxyPort = data.data.settings.socksProxyPort;
			systemTrayEnabled = data.data.settings.systemTrayEnabled;
			updateMangas = data.data.settings.updateMangas;
			webUIChannel = data.data.settings.webUIChannel;
			webUIFlavor = data.data.settings.webUIFlavor;
			webUIInterface = data.data.settings.webUIInterface;
			webUIUpdateCheckInterval = data.data.settings.webUIUpdateCheckInterval;
		}
	});
</script>

{#if $settingsData.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify($settingsData.error, null, 4)}
	</div>
{:else if $settingsData.fetching}
	Loading...
{:else if $settingsData.data}
	{@const settings = $settingsData.data.settings}
	<div class="[&>*]:px-4">
		<!-- autoDownloadNewChapters -->
		<Toggle
			title="Auto Download New Chapters"
			bind:checked={autoDownloadNewChapters}
			on:change={() => setSettings({ autoDownloadNewChapters })}
		/>
		<!-- backupInterval -->
		<Number
			title="Backup Interval (in days)"
			bind:value={backupInterval}
			max={14}
			on:change={() => setSettings({ backupInterval })}
		/>
		<!-- backupPath -->
		<Text
			title="Backup Path"
			bind:value={backupPath}
			on:change={() => setSettings({ backupPath })}
		/>
		<!-- backupTTL -->
		<Number
			title="Backup TTL (in days)"
			value={backupTTL}
			max={365}
			on:change={() => setSettings({ backupTTL })}
		/>
		<!-- backupTime -->
		<Text
			title="Backup Time"
			bind:value={backupTime}
			on:change={() => {
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
			on:change={() => setSettings({ basicAuthEnabled })}
		/>
		<!-- basicAuthPassword -->
		<Text
			title="Basic Auth Password"
			bind:value={basicAuthPassword}
			on:change={() => setSettings({ basicAuthPassword })}
			type="password"
		/>
		<!-- basicAuthUsername -->
		<Text
			title="Basic Auth Username"
			bind:value={basicAuthUsername}
			on:change={() => setSettings({ basicAuthUsername })}
		/>
		<!-- debugLogsEnabled -->
		<Toggle
			title="Debug Logs"
			bind:checked={debugLogsEnabled}
			on:change={() => setSettings({ debugLogsEnabled })}
		/>
		<!-- downloadAsCbz -->
		<Toggle
			title="Download as CBZ"
			bind:checked={downloadAsCbz}
			on:change={() => setSettings({ downloadAsCbz })}
		/>
		<!-- downloadsPath -->
		<Text
			title="Downloads Path"
			bind:value={downloadsPath}
			on:change={() => setSettings({ downloadsPath })}
		/>
		<!-- electronPath -->
		<Text
			title="Electron Path"
			bind:value={electronPath}
			on:change={() => setSettings({ electronPath })}
		/>
		<!-- excludeCompleted -->
		<Toggle
			title="Exclude Completed"
			bind:checked={excludeCompleted}
			on:change={() => setSettings({ excludeCompleted })}
		/>
		<!-- excludeEntryWithUnreadChapters -->
		<Toggle
			title="Exclude Entry With Unread Chapters"
			bind:checked={excludeEntryWithUnreadChapters}
			on:change={() => setSettings({ excludeEntryWithUnreadChapters })}
		/>
		<!-- excludeNotStarted -->
		<Toggle
			title="Exclude Not Started"
			bind:checked={excludeNotStarted}
			on:change={() => setSettings({ excludeNotStarted })}
		/>
		<!-- extensionRepos -->
		<button
			class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
			on:click={() => {
				modalStore.trigger({
					type: 'component',
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
			on:change={() => setSettings({ excludeUnreadChapters })}
		/>
		<!-- flareSolverrEnabled -->
		<Toggle
			title="Flare Solverr"
			bind:checked={flareSolverrEnabled}
			on:change={() => setSettings({ flareSolverrEnabled })}
		/>
		<!-- flareSolverrSessionName -->
		<Text
			title="Flare Solverr Session Name"
			bind:value={flareSolverrSessionName}
			on:change={() => setSettings({ flareSolverrSessionName })}
		/>
		<!-- flareSolverrSessionTtl -->
		<Number
			title="Flare Solverr Session Ttl"
			value={flareSolverrSessionTtl}
			max={365}
			on:change={() => setSettings({ flareSolverrSessionTtl })}
		/>
		<!-- flareSolverrTimeout -->
		<Number
			title="Flare Solverr Timeout"
			value={flareSolverrTimeout}
			max={365}
			on:change={() => setSettings({ flareSolverrTimeout })}
		/>
		<!-- flareSolverrUrl -->
		<Text
			title="Flare Solverr Url"
			bind:value={flareSolverrUrl}
			on:change={() => setSettings({ flareSolverrUrl })}
		/>
		<!-- globalUpdateInterval -->
		<Number
			title="Global Update Interval (in hours)"
			value={globalUpdateInterval}
			max={365}
			on:change={() => setSettings({ globalUpdateInterval })}
		/>
		<!-- gqlDebugLogsEnabled -->
		<Toggle
			title="GQL Debug Logs"
			bind:checked={gqlDebugLogsEnabled}
			on:change={() => setSettings({ gqlDebugLogsEnabled })}
		/>
		<!-- initialOpenInBrowserEnabled -->
		<Toggle
			title="Initial Open In Browser"
			bind:checked={initialOpenInBrowserEnabled}
			on:change={() => setSettings({ initialOpenInBrowserEnabled })}
		/>
		<!-- ip -->
		<Text
			title="IP"
			bind:value={ip}
			on:change={() => {
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
			on:change={() => setSettings({ localSourcePath })}
		/>
		<!-- maxSourcesInParallel -->
		<Number
			title="Max Sources In Parallel"
			value={maxSourcesInParallel}
			max={10}
			on:change={() => setSettings({ maxSourcesInParallel })}
		/>
		<!-- port -->
		<Number
			title="Port"
			value={port}
			max={65535}
			on:change={() => {
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
			on:change={() => setSettings({ socksProxyEnabled })}
		/>
		<!-- socksProxyHost -->
		<Text
			title="Socks Proxy Host"
			bind:value={socksProxyHost}
			on:change={() => setSettings({ socksProxyHost })}
		/>
		<!-- socksProxyPort -->
		<Text
			title="Socks Proxy Port"
			bind:value={socksProxyPort}
			on:change={() => {
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
		<!-- systemTrayEnabled -->
		<Toggle
			title="System Tray"
			bind:checked={systemTrayEnabled}
			on:change={() => setSettings({ systemTrayEnabled })}
		/>
		<!-- updateMangas -->
		<Toggle
			title="Update Mangas"
			bind:checked={updateMangas}
			on:change={() => setSettings({ updateMangas })}
		/>
		<!-- webUIChannel -->
		<Select
			title="Web UI Channel"
			bind:value={webUIChannel}
			options={webUIChannels}
			on:change={() => setSettings({ webUIChannel })}
		/>
		<!-- webUIFlavor -->
		<Select
			title="Web UI Flavor"
			bind:value={webUIFlavor}
			options={webUIFlavors}
			on:change={() => setSettings({ webUIFlavor })}
		/>
		<!-- webUIInterface -->
		<Select
			title="Web UI Interface"
			bind:value={webUIInterface}
			options={webUIInterfaces}
			on:change={() => setSettings({ webUIInterface })}
		/>
		<!-- webUIUpdateCheckInterval -->
		<Number
			title="Web UI Update Check Interval (in hours)"
			value={webUIUpdateCheckInterval}
			max={100}
			on:change={() => setSettings({ webUIUpdateCheckInterval })}
		/>
	</div>
{/if}