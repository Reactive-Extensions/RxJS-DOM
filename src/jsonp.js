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
   *   source = Rx.DOM.Request.jsonpRequestCold('http://www.bing.com/?q=foo&JSONPRequest=?');
   *   source = Rx.DOM.Request.jsonpRequestCold( url: 'http://bing.com/?q=foo', jsonp: 'JSONPRequest' });
   *
   * @param {Object} settings Can be one of the following:
   *
   *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
   *  An object with the following properties
   *   - url: URL of the request
   *   - jsonp: The named callback parameter for the JSONP call
   *
   * @returns {Observable} A cold observable containing the results from the JSONP call.
   */
  var getJSONPRequestCold = ajax.jsonpRequestCold = (function () {
      var uniqueId = 0;
      return function (settings) {
        return new AnonymousObservable(function (observer) {

          if (typeof settings === 'string') {
            settings = { url: settings }
          }
          if (!settings.jsonp) {
            settings.jsonp = 'JSONPCallback';
          }

          var head = document.getElementsByTagName('head')[0] || document.documentElement,
            tag = document.createElement('script'),
            handler = 'rxjscallback' + uniqueId++;

          settings.url = settings.url.replace('=' + settings.jsonp, '=' + handler);

          root[handler] = function (data) {
            observer.onNext(data);
            observer.onCompleted();  
          };

          tag.src = settings.url;
          tag.async = true;
          tag.onload = tag.onreadystatechange = function (_, abort) {
            if ( abort || !tag.readyState || /loaded|complete/.test(tag.readyState) ) {
              tag.onload = tag.onreadystatechange = null;
              if (head && tag.parentNode) {
                destroy(tag);
              }
              tag = undefined;
              root[handler] = undefined;
              delete root[handler];
            }
          };  
          head.insertBefore(tag, head.firstChild);

          return function () {
            if (!tag) { return; }
            tag.onload = tag.onreadystatechange = null;
            if (head && tag.parentNode) {
              destroy(tag);
            }
            tag = undefined;
            root[handler] = undefined;
            delete root[handler];
          };
        });
      };      

  })();

  /**
   * Creates a hot observable JSONP Request with the specified settings.
   *
   * @example 
   *   source = Rx.DOM.Request.getJSONPRequest('http://www.bing.com/?q=foo&JSONPRequest=?');
   *   source = Rx.DOM.Request.getJSONPRequest( url: 'http://bing.com/?q=foo', jsonp: 'JSONPRequest' });
   * 
   * @param {Object} settings Can be one of the following:
   *
   *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
   *  An object with the following properties
   *   - url: URL of the request
   *   - jsonp: The named callback parameter for the JSONP call
   *
   * @returns {Observable} A hot observable containing the results from the JSONP call.
   */
  ajax.jsonpRequest = function (settings) {
    return getJSONPRequestCold(settings).publishLast().refCount();
  };