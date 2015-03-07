  /** @private
   * Destroys the current element
   */
  var destroy = (function () {
    var trash = document.createElement('div');
    return function (element) {
      trash.appendChild(element);
      trash.innerHTML = '';
    };
  })();

  /**
   * Creates a cold observable JSONP Request with the specified settings.
   *
   * @example
   *   source = Rx.DOM.jsonpRequest('http://www.bing.com/?q=foo&JSONPCallback=?');
   *   source = Rx.DOM.jsonpRequest( url: 'http://bing.com/?q=foo', jsonp: 'JSONPCallback' });
   *
   * @param {Object} settings Can be one of the following:
   *
   *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
   *  An object with the following properties
   *   - url: URL of the request
   *   - jsonp: The named callback parameter for the JSONP call
   *   - jsonpCallback: Callback to execute. For when the JSONP callback can't be changed
   *
   * @returns {Observable} A cold observable containing the results from the JSONP call.
   */
  dom.jsonpRequest = (function () {
    var uniqueId = 0;
    var defaultCallback = function _defaultCallback(observer, data) {
      observer.onNext(data);
      observer.onCompleted();
    };

    return function (settings) {
      return new AnonymousObservable(function (observer) {
        typeof settings === 'string' && (settings = { url: settings });
        !settings.jsonp && (settings.jsonp = 'JSONPCallback');

        var head = document.getElementsByTagName('head')[0] || document.documentElement,
          tag = document.createElement('script'),
          handler = 'rxjscallback' + uniqueId++;

        if (typeof settings.jsonpCallback === 'string') {
          handler = settings.jsonpCallback;
        }

        settings.url = settings.url.replace(new RegExp('([?|&]'+settings.jsonp+'=)[^\&]+'), '$1' + handler);

        var existing = root[handler];
        root[handler] = function(data, recursed) {
          if (existing) {
            existing(data, true) && (existing = null);
            return false;
          }
          defaultCallback(observer, data);
          !recursed && (root[handler] = null);
          return true;
        };

        var cleanup = function _cleanup() {
          tag.onload = tag.onreadystatechange = null;
          head && tag.parentNode && destroy(tag);
          tag = undefined;
        };

        tag.src = settings.url;
        tag.async = true;
        tag.onload = tag.onreadystatechange = function (_, abort) {
          if ( abort || !tag.readyState || /loaded|complete/.test(tag.readyState) ) {
            cleanup();
          }
        };
        head.insertBefore(tag, head.firstChild);

        return function () {
          if (!tag) { return; }
          cleanup();
        };
      });
    };
  })();
