// Badge Event
// unique id: g|057|55632|n (Random*3 + TIME*5)
var uniqueId = [
  "g",
  ("0" + ~~ (Math.random() * 100)).slice(-3),
  String(new Date().getTime()).slice(-5),
  "n"
].join("");
document.addEventListener(uniqueId + "ctob", function (context) {
  // Badge update
  // response
  document.dispatchEvent(uniqueId + "btoc", this);
});

// URL parse
function parse(url) {
  var parse = document.createElement("a");
  parse.href = url;
  return parse;
}
// show confirm window
function confirmString(method, url, data) {
  method = method.toUpperCase();
  data = data === undefined ? "none" : JSON.stringify(data, null, "  ");
  console.log("%s %s に通信しようとしています。", method, url);
  console.log(data);
  return [
    "次のデータが外部へ送られようとしています。",
    "宛先:" + " " + method + " " + url,
    "データ:" + " " + data
  ].join("\n");
}
// form hack
function formCheck(callback) {
  var url = parse(this.action),
      method = this.method,
      inputs = this.getElementsByTagName("input"),
      data = {},
      input;
  
  if (url.origin === location.origin)
    return true;
  
  for (var i = 0, l = inputs.length; i < l; i++) {
    input = inputs[i];
    if (input.name)
      data[input.name] = input.value;
  }
  
  return confirm(confirmString(method, url.href, data));
}

// Insert Script
var xhr = new XMLHttpRequest();
xhr.open("get", chrome.extension.getURL("scripts/guardian.js"), false);
xhr.addEventListener("load", function () {
  document.addEventListener("DOMContentLoaded", function () {
    var code = [
      "!",
      Function("uniqueId", "parse", "confirmString", "formCheck", xhr.responseText).toString(),
      "(",
      [
        '"' + uniqueId + '"',
        parse.toString(),
        confirmString.toString(),
        formCheck.toString()
      ].join(","),
      ")"
    ].join("");
    var s = document.createElement("script");
        s.appendChild(document.createTextNode(code));
    this.head.appendChild(s);
  });
});
xhr.send();

// form submit button event hack
window.addEventListener("submit", function (event) {
  console.log("button");
  if (! formCheck.call(event.target))
    event.preventDefault();
});