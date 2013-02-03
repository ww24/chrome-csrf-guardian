/**
 * Chrome CSRF Guradian
 * scripts/guadian.js
 */

(function () {
  function ObjectKey() {
    var keys = [],
        values = {};
    return function (key, value) {
      if (value !== undefined)
        values[keys.indexOf(key) + 1 || keys.push(key)] = value;
      else if (key !== undefined)
        return values[keys.indexOf(key) + 1];
      else
        return values;
    };
  }
  
  function parse(url) {
    var parse = document.createElement("a");
    parse.href = url;
    return parse;
  }
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
  // form.submit() hack
  var formSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function () {
    console.log("method");
    if (formCheck.call(this))
      return formSubmit.apply(this, arguments);
  };
  // form submit button event hack
  window.addEventListener("submit", function (event) {
    console.log("button");
    if (! formCheck.call(event.target))
      event.preventDefault();
  });
  
  // XHR hack
  var XHROpen = XMLHttpRequest.prototype.open,
      XHRSend = XMLHttpRequest.prototype.send,
      xhrList = new ObjectKey();
  XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
    xhrList(this, {
      method: method,
      url: url
    });
    return XHROpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    var target = xhrList(this),
        method = target.method,
        url = parse(target.url);
    
    if (url.origin !== location.origin)
      if (! confirm(confirmString(method, url, body)))
        return false;
    
    return XHRSend.call(this, body);
  };
})();