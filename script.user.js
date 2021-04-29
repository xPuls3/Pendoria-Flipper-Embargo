// ==UserScript==
// @name Pendoria Flipper Embargo
// @namespace http://pendoria.net/
// @version 1.0.1
// @author Puls3
// @include /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @homepage https://github.com/xPuls3/Pendoria-Flipper-Embargo
// @supportURL https://github.com/xPuls3/Pendoria-Flipper-Embargo/issues
// @downloadURL https://github.com/xPuls3/Pendoria-Flipper-Embargo/raw/master/script.user.js
// @updateURL https://github.com/xPuls3/Pendoria-Flipper-Embargo/raw/master/script.user.js
// @icon https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/master/favicon.ico
// @grant none
// @run-at document-start
// @description Highlights the names of known flippers.
// ==/UserScript==

// Pendoria Flipper Embargo is only officially distributed on GitHub!
// - https://github.com/xPuls3/Pendoria-Flipper-Embargo/

// This script was created by Puls3!
// - Puls3 on Pendoria

let originalAjaxPost = null;
let flippers = null;

window.addEventListener("DOMContentLoaded", () => {
    initiate();
})

function initiate() {

    originalAjaxPost = window["ajaxPost"];

    const styleElement = document.createElement("style");
    styleElement.innerText = ".dirty-flipper { color: yellow !important; }"

    document.head.append(styleElement)

    window["jQuery"].get("https://raw.githubusercontent.com/xPuls3/pendoria-flipper-registry/main/list.json", (data) => {

        console.log("Loaded flippers from remote registry.");

        flippers = JSON.parse(data);
        window["ajaxPost"] = newAjaxPost;

    })

}

function newAjaxPost(...args) {

    if (!args[0].startsWith("/market/")) return originalAjaxPost(...args);

    originalAjaxPost(args[0], (data) => {

        if (!(typeof data === "string")) return args[1](data);

        let newData = data;

        for (let i = 0; i <= flippers.length; i++) {

            if (i === flippers.length) return args[1](newData);

            const flipperId = String(flippers[i].id);
            const regex = new RegExp(`data-player-id=\"${flipperId}\">`, "gi");
            newData = newData.replace(regex, `data-player-id=\"${flipperId}\" class=\"dirty-flipper\"`)

        }

    })

}
