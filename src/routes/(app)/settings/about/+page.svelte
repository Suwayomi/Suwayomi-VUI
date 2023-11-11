<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { about as getabout } from '$lib/generated';

	let about = getabout({});
	AppBarData('About');
</script>

{#if $about.loading}
	loading...
{:else if $about.error}
	{JSON.stringify($about.error)}
{:else if $about.data}
	<!-- {JSON.stringify($about.data)} -->
	<div class="pt-2">
		<div class="pl-4 py-2">
			<div class="text-xl">Server</div>
			<div class="opacity-80">
				{$about.data.about.name}
				{$about.data.about.buildType}
			</div>
		</div>
		{#if window.version}
			<div class="pl-4 py-2">
				<div class="text-xl">client version</div>
				<div class="opacity-80">
					VUI-{window.version}
				</div>
			</div>
		{/if}
		<div class="pl-4 py-2">
			<div class="text-xl">Server version</div>
			<div class="opacity-80">
				{$about.data.about.version}-{$about.data.about.revision}
			</div>
		</div>
		<div class="pl-4 py-2">
			<div class="text-xl">Build time</div>
			<div class="opacity-80">
				{new Date($about.data.about.buildTime * 1000).toUTCString()}
			</div>
		</div>
		<a class="block hover:variant-glass-surface pl-4 py-2" href={$about.data.about.github}>
			<div class="text-xl">Github</div>
			<div class="opacity-80">
				{$about.data.about.github}
			</div>
		</a>
		<a class="block hover:variant-glass-surface pl-4 py-2" href={$about.data.about.discord}>
			<div class="text-xl">Discord</div>
			<div class="opacity-80">
				{$about.data.about.discord}
			</div>
		</a>
	</div>
{/if}
