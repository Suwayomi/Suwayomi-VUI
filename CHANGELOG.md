# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- (**SyncYomi**) Add SyncYomi section to server settings with enable/disable toggle, server address, API key, auto-sync interval, data sync toggles, and trigger configuration (chapter read, chapter open, client start, client resume)
- (**SyncYomi**) Add `SyncTriggerHandler` component (mounted in the app layout) that fires sync on client start and resume based on configured settings
- (**SyncYomi**) Show "Syncing library..." persistent progress toast and completion/error toasts via the `syncStatusChanged` subscription

### Fixed

- (**SyncYomi**) Fix auto-sync interval dropdown showing raw ISO 8601 values (`PT15M`) instead of human-readable labels ("15 minutes") by extending `Select` component to accept `{ value, label }` option objects
- (**SyncYomi**) Fix header title reverting to "Loading..." after triggering a manual sync — eliminated the duplicate `serverSettings` query in `SyncTriggerHandler` by sharing sync settings via a Svelte store written by the settings page
- (**ServiceWorker**) Call `skipWaiting()` on install so new builds activate immediately without requiring all tabs to close
