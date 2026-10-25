# Custom Cookie

Big cookie skin manager for Cookie Clicker. Replace the big cookie with an image from a URL or a local file.

![image](https://github.com/user-attachments/assets/bd798fb9-bc0b-4f6f-896c-6167bb34c67f)

## Usage and settings

Open **Options → Custom Cookie Settings** to configure:

- **Get image from**: use a link or upload a file. Uploaded images are stored in your browser's localStorage, not in the game's save file.
- **Round image**: clip the image to a circle (off by default).
- **Image fit**: contain (default, preserve proportions and fit the whole image), cover (preserve proportions and fill the area), or fill (stretch to fill).
- **Drop shadow**: add a shadow to the image (on by default).
- **Reset to default**: clear the custom image and restore the original cookie.

Use **Collapse/Expand** to hide or show the settings. The collapsed state is saved with the game.

## Installation

### Steam

[Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3357678293)

### Userscript (browser)

Code for tampermonkey:

```
// ==UserScript==
// @name         Custom Cookie skin
// @namespace    http://tampermonkey.net/
// @version      2024-10-25
// @description  Big cookie skin manager! Made by @swbuwk
// @author       You
// @match        http://*/*
// @include http://orteil.dashnet.org/cookieclicker/
// @include http://orteil.dashnet.org/cookieclicker/beta/
// @include https://orteil.dashnet.org/cookieclicker/
// @include https://orteil.dashnet.org/cookieclicker/beta/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

const readyCheck = setInterval(() => {
  if (
    typeof Game !== "undefined" &&
    typeof Game.ready !== "undefined" &&
    Game.ready
  ) {
    Game.LoadMod("https://swbuwk-cc.github.io/custom-cookie/dist/CustomCookie.js");
    clearInterval(readyCheck);
  }
}, 1000);
```

### Bookmarklet (browser)

Make a bookmark in your browser and paste this into its URL. Open Cookie Clicker, wait for it to load, then click the bookmark. Run it again after reloading the page.

```
javascript: (() => { Game.LoadMod("https://swbuwk-cc.github.io/custom-cookie/dist/CustomCookie.js"); })()
```

## Development

Requires Node.js and npm.

```sh
npm ci
cp .env.example .env
npm run typecheck
npm run lint
npm run build
```

`APP_NAME` in `.env` controls the mod name and output filename (default: `CustomCookie`).

- `npm run dev`: watch TypeScript sources and write the development bundle to `build/CustomCookie.js`.
- `npm run build`: write the production bundle and source map to `dist/`.

The installation snippets above load the published bundle, not your local build. To test local changes, serve the bundle at a URL accessible to the game and load it with `Game.LoadMod(...)`.
