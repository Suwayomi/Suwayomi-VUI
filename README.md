# Tachidesk-VUI

Robonau's Svelte + skeleton tachidesk UI

| Discord                                                                                                                                                    | Github                                                                                                                                                                                                                                                                                                                                                                                                                                    | Docker                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Discord](https://img.shields.io/discord/801021177333940224.svg?label=discord&labelColor=7289da&color=2c2f33&style=flat)](https://discord.gg/DDZdqZWaHA) | ![](https://img.shields.io/github/stars/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/forks/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/tag/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/release/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/issues/Suwayomi/Tachidesk-VUI.svg) ![](https://github.com/Suwayomi/Tachidesk-VUI/actions/workflows/build.yml/badge.svg) | ![](https://ghcr-badge.deta.dev/suwayomi/tachidesk-vui/latest_tag?filter=latest) ![](https://ghcr-badge.deta.dev/suwayomi/tachidesk-vui/size?filter=latest) |

# How To Use:

## Web Server files

The Tachidesk-VUI-Web.zip file in the release is for hosting the ui though a webserver  
It should also be possible to replace the contents of the webUI folder in the Tachidesk data directory, though this is not recommended

## Docker

#### Compose

```yaml
version: '3.7'
services:
  tachideskvui:
    image: ghcr.io/suwayomi/tachidesk-vui:latest
    ports:
      - '9013:8080'
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
