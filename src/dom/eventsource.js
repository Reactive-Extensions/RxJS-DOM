  var EventSourceObservable = (function(__super__) {
    inherits(EventSourceObservable, __super__);
    function EventSourceObservable(url, open) {
      this._url = url;
      this._open = open;
      __super__.call(this);
    }

    function createOnOpen(o, source) {
      return function onOpen(e) {
        o.onNext(e);
        o.onCompleted();
        source.removeEventListener('open', onOpen, false);
      };
    }

    function createOnError(o) {
      return function onError(e) {
        if (e.readyState === EventSource.CLOSED) {
          o.onCompleted();
        } else {
          o.onError(e);
        }
      };
    }

    function createOnMessage(o) { return function onMessage(e) { o.onNext(e.data); }; }

    function EventSourceDisposable(s, errFn, msgFn) {
      this._s = s;
      this._errFn = errFn;
      this._msgFn = msgFn;
      this.isDisposed = false;
    }

    EventSourceDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this._s.removeEventListener('error', this._errFn, false);
        this._s.removeEventListener('message', this._msgFn, false);
        this._s.close();
      }
    };

    EventSourceObservable.prototype.subscribeCore = function (o) {
      var source = new EventSource(this._url);
      var onOpen = createOnOpen(this._open, source);
      var onError = createOnError(o);
      var onMessage = createOnMessage(o);

      this._open && source.addEventListener('open', onOpen, false);
      source.addEventListener('error', onError, false);
      source.addEventListener('message', onMessage, false);

      return new EventSourceDisposable(source, onError, onMessage);
    };

    return EventSourceObservable;
  }(ObservableBase));

  /**
   * This method wraps an EventSource as an observable sequence.
   * @param {String} url The url of the server-side script.
   * @param {Observer} [openObserver] An optional observer for the 'open' event for the server side event.
   * @returns {Observable} An observable sequence which represents the data from a server-side event.
   */
  dom.fromEventSource = function (url, openObserver) {
    if (!root.EventSource) { throw new TypeError('EventSource not implemented in your runtime.'); }
    return new EventSourceObservable(url, openObserver);
  };
