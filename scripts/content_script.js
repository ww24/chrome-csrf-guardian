// Insert Script
var xhr = new XMLHttpRequest();
xhr.open("get", chrome.extension.getURL("scripts/guardian.js"), false);
xhr.addEventListener("load", function () {
  document.addEventListener("DOMContentLoaded", function () {
    var s = document.createElement("script");
        s.innerHTML = xhr.responseText;
    this.head.appendChild(s);
  });
});
xhr.send();