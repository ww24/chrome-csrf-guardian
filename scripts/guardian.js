/**
 * Chrome CSRF Guradian
 * scripts/guadian.js
 */

console.log(uniqueId);

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

// form.submit() hack
var formSubmit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = function () {
  console.log("method");
  if (formCheck.call(this))
    return formSubmit.apply(this, arguments);
};

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