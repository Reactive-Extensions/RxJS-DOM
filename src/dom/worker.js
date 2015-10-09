  var WorkerObserver = (function (__super__) {
    inherits(WorkerObserver, __super__);
    function WorkerObserver(state) {
      this._state = state;
      __super__.call(this);
    }

    WorkerObserver.prototype.next = function (x) { this._state.worker && this._state.worker.postMessage(x); };
    WorkerObserver.prototype.error = function (e) { throw e; };
    WorkerObserver.prototype.completed = function () { };

    return WorkerObserver;
  }(AbstractObserver));

  var WorkerObservable = (function (__super__) {
    inherits(WorkerObservable, __super__);
    function WorkerObservable(state, url) {
      this._state = state;
      this._url = url;
      __super__.call(this);
    }

    function createMessageHandler(o) { return function messageHandler (e) { o.onNext(e); }; }
    function createErrHandler(o) { return function errHandler(e) { o.onError(e); }; }

    function WorkerDisposable(w, msgFn, errFn) {
      this._w = w;
      this._msgFn = msgFn;
      this._errFn = errFn;
      this.isDisposed = false;
    }

    WorkerDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._w.terminate();
        this._w.removeEventListener('message', this._msgFn, false);
        this._w.removeEventListener('error', this._errFn, false);
      }
    };

    WorkerObservable.prototype.subscribeCore = function (o) {
      this._state.worker = new root.Worker(this._url);

      var messageHandler = createMessageHandler(o);
      var errHandler = createErrHandler(o);

      this._state.worker.addEventListener('message', messageHandler, false);
      this._state.worker.addEventListener('error', errHandler, false);

      return new WorkerDisposable(this._state.worker, messageHandler, errHandler);
    };

    return WorkerObservable;
  }(ObservableBase));

  /**
   * Creates a Web Worker with a given URL as a Subject.
   *
   * @example
   * var worker = Rx.DOM.fromWebWorker('worker.js');
   *
   * @param {String} url The URL of the Web Worker.
   * @returns {Subject} A Subject wrapping the Web Worker.
   */
  dom.fromWorker = function (url) {
    if (!root.Worker) { throw new TypeError('Worker not implemented in your runtime.'); }
    var state = { worker: null };
    return Subject.create(new WorkerObserver(state), new WorkerObservable(state, url));
  };
