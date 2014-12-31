
  /* @private
   * Gets the proper XMLHttpRequest for support for older IE
   */
  function getXMLHttpRequest() {
    if (root.XMLHttpRequest) {
      return new root.XMLHttpRequest;
    } else {
      try {
        return new root.ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {
        throw new Error('XMLHttpRequest is not supported by your browser');
      }
    }
  }

  /**
   * Creates a cold observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.
   *
   * @example
   *   source = Rx.DOM.ajax('/products');
   *   source = Rx.DOM.ajax( url: 'products', method: 'GET' });
   *
   * @param {Object} settings Can be one of the following:
   *
   *  A string of the URL to make the Ajax call.
   *  An object with the following properties
   *   - url: URL of the request
   *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
   *   - async: Whether the request is async
   *   - headers: Optional headers
   *
   * @returns {Observable} An observable sequence containing the XMLHttpRequest.
  */
  var ajaxRequest = dom.ajax = function (settings) {
    return new AnonymousObservable(function (observer) {
      var isDone = false;
      if (typeof settings === 'string') {
        settings = { method: 'GET', url: settings, async: true };
      }
      settings.method || (settings.method = 'GET');
      if (settings.async === undefined) {
        settings.async = true;
      }

      var xhr;
      try {
        xhr = getXMLHttpRequest();
      } catch (err) {
        observer.onError(err);
      }

      try {
        if (settings.user) {
          xhr.open(settings.method, settings.url, settings.async, settings.user, settings.password);
        } else {
          xhr.open(settings.method, settings.url, settings.async);
        }

        if (settings.headers) {
          var headers = settings.headers;
          for (var header in headers) {
            if (hasOwnProperty.call(headers, header)) {
              xhr.setRequestHeader(header, headers[header]);
            }
          }
        }

        xhr.onreadystatechange = xhr.onload = function () {
          if (xhr.readyState === 4) {
            var status = xhr.status;
            if ((status >= 200 && status <= 300) || status === 0 || status === '') {
              observer.onNext(xhr);
              observer.onCompleted();
            } else {
              observer.onError(xhr);
            }

            isDone = true;
          }
        };

        xhr.onerror = function () {
          observer.onError(xhr);
        };

        xhr.send(settings.body || null);
      } catch (e) {
        observer.onError(e);
      }

      return function () {
        if (!isDone && xhr.readyState !== 4) { xhr.abort(); }
      };
    });
  };

  /**
   * Creates an observable sequence from an Ajax POST Request with the body.
   *
   * @param {String} url The URL to POST
   * @param {Object} body The body to POST
   * @returns {Observable} The observable sequence which contains the response from the Ajax POST.
   */
  dom.post = function (url, body) {
    return ajaxRequest({ url: url, body: body, method: 'POST', async: true });
  };

  /**
   * Creates an observable sequence from an Ajax GET Request with the body.
   *
   * @param {String} url The URL to GET
   * @returns {Observable} The observable sequence which contains the response from the Ajax GET.
   */
  var observableGet = dom.get = function (url) {
    return ajaxRequest({ url: url, method: 'GET', async: true });
  };

  /**
   * Creates an observable sequence from JSON from an Ajax request
   *
   * @param {String} url The URL to GET
   * @returns {Observable} The observable sequence which contains the parsed JSON.
   */
  dom.getJSON = function (url) {
    if (!root.JSON && typeof root.JSON.parse !== 'function') { throw new TypeError('JSON is not supported in your runtime.'); }
    return observableGet(url).map(function (xhr) {
      return JSON.parse(xhr.responseText);
    });
  };
