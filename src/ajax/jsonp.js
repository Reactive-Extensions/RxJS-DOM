  var destroy = (function () {
    var trash = 'document' in root && root.document.createElement('div');
    return function (element) {
      trash.appendChild(element);
      trash.innerHTML = '';
    };
  })();

  var ScriptObservable = (function(__super__) {
    inherits(ScriptObservable, __super__);
    function ScriptObservable(settings) {
      this._settings = settings;
      __super__.call(this);
    }

    ScriptObservable.id = 0;

    ScriptObservable.prototype.subscribeCore = function (o) {
      var settings = {
        jsonp: 'JSONPCallback',
        async: true,
        jsonpCallback: 'rxjsjsonpCallbacks' + 'callback_' + (ScriptObservable.id++).toString(36)
      };

      if(typeof this._settings === 'string') {
        settings.url = this._settings;
      } else {
        for(var prop in this._settings) {
          if(hasOwnProperty.call(this._settings, prop)) {
            settings[prop] = this._settings[prop];
          }
        }
      }

      var script = root.document.createElement('script');
      script.type = 'text/javascript';
      script.async = settings.async;
      script.src = settings.url.replace(settings.jsonp, settings.jsonpCallback);

      root[settings.jsonpCallback] = function(data) {
        root[settings.jsonpCallback].called = true;
        root[settings.jsonpCallback].data = data;
      };

      var handler = function(e) {
        if(e.type === 'load' && !root[settings.jsonpCallback].called) {
          e = { type: 'error' };
        }
        var status = e.type === 'error' ? 400 : 200;
        var data = root[settings.jsonpCallback].data;

        if(status === 200) {
          o.onNext({
            status: status,
            responseType: 'jsonp',
            response: data,
            originalEvent: e
          });

          o.onCompleted();
        }
        else {
          o.onError({
            type: 'error',
            status: status,
            originalEvent: e
          });
        }
      };

      script.onload = script.onreadystatechanged = script.onerror = handler;

      var head = root.document.getElementsByTagName('head')[0] || root.document.documentElement;
      head.insertBefore(script, head.firstChild);

      return new ScriptDisposable(script);
    };

    function ScriptDisposable(script) {
      this._script = script;
      this.isDisposed = false;
    }

    ScriptDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._script.onload = this._script.onreadystatechanged = this._script.onerror = null;
        destroy(this._script);
        this._script = null;
      }
    };

    return ScriptObservable;
  }(ObservableBase));

  /**
   * Creates an observable JSONP Request with the specified settings.
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
   dom.jsonpRequest = function (settings) {
     return new ScriptObservable(settings);
   };
