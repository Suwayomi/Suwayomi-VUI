# Tachidesk-VUI

Robonau's Vue + Quasar tachidesk UI

| Discord                                                                                                                                                    | Github                                                                                                                                                                                                                                                                                                                                                                                                                                    | Docker                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Discord](https://img.shields.io/discord/801021177333940224.svg?label=discord&labelColor=7289da&color=2c2f33&style=flat)](https://discord.gg/DDZdqZWaHA) | ![](https://img.shields.io/github/stars/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/forks/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/tag/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/release/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/issues/Suwayomi/Tachidesk-VUI.svg) ![](https://github.com/Suwayomi/Tachidesk-VUI/actions/workflows/build.yml/badge.svg) | ![](https://ghcr-badge.deta.dev/suwayomi/tachidesk-vui/latest_tag?filter=latest) ![](https://ghcr-badge.deta.dev/suwayomi/tachidesk-vui/size?filter=latest) |

# How To Use:

## Easy mode

https://tachidesk-vui.github.io/

## Elctron application

Installable via the releases labeled with electron

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
      - '9013:80'
    restart: unless-stopped
```

# DEVs:

## Install the dependencies

```
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev -m pwa
```

### Lint the files

```bash
npm run lint
```

### Format the files

```bash
npm run format
```

### Build the app for production

```bash
quasar build -m pwa
```

## useful:

[Quasar dev wiki](https://quasar.dev/)
