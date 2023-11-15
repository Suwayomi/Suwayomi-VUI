// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare interface Window {
	version: string | undefined;
}

declare interface Navigator {
	userAgentData?: {
		mobile?: boolean;
	};
}
