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
  if (typeof Game !== 'undefined' && typeof Game.ready !== 'undefined' && Game.ready) {
    Game.LoadMod("https://swbuwk-cc.github.io/custom-cookie/dist/CustomCookie.js");
    clearInterval(readyCheck);
  }
}, 1000);

