# Suwayomi-VUI

Robonau's Svelte + skeleton suwayomi UI

| Discord                                                                                                                                                    | Github                                                                                                                                                                                                                                                                                                                                                                                                                              | Docker                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Discord](https://img.shields.io/discord/801021177333940224.svg?label=discord&labelColor=7289da&color=2c2f33&style=flat)](https://discord.gg/DDZdqZWaHA) | ![](https://img.shields.io/github/stars/Suwayomi/Suwayomi-VUI.svg) ![](https://img.shields.io/github/forks/Suwayomi/Suwayomi-VUI.svg) ![](https://img.shields.io/github/tag/Suwayomi/Suwayomi-VUI.svg) ![](https://img.shields.io/github/release/Suwayomi/Suwayomi-VUI.svg) ![](https://img.shields.io/github/issues/Suwayomi/Suwayomi-VUI.svg) ![](https://github.com/Suwayomi/Suwayomi-VUI/actions/workflows/build.yml/badge.svg) | ![](https://ghcr-badge.deta.dev/suwayomi/suwayomi-vui/latest_tag?filter=latest) ![](https://ghcr-badge.deta.dev/suwayomi/suwayomi-vui/size?filter=latest) |

# How To Use:

## Suwayomi Server Integrated

when running the Suwayomi server you can change the WebUI Flavor to VUI, it will then replace the Default WebUI with VUI.

## Web Server files

The Suwayomi-VUI-Web.zip file in the release is for hosting the ui though `server.webUIFlavor = "Custom"` config and replacing the contents of the webUI folder in the Suwayomi data directory

The files could also be used in a stand alone webserver though you would have to redirect `/api` trafic to suwayomi server

## Docker

#### Compose

```yaml
version: '3.7'
services:
  vui3:
    image: ghcr.io/suwayomi/suwayomi-vui
    ports:
      - '9013:8080'
    environment:
      - suwayomi=http://suwayomi:4567/
      # will proxy the suwayomi server to the UI
      # if you plan on proxying it externally then this is unnecessary
      - theme=skeleton
      # defaults to skeleton
      # is for the SSR to stop off first loads
      # any of the themes avalabe in VUI
      # skeleton, wintry, crimson, gold-nouveau, hamlindigo, modern, rocket, sahara, seafoam, vintage
    restart: unless-stopped
```

## Developing

install dependencies with `bun install`

start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
```
