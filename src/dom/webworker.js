  var WorkerObserver = (function (__super__) {
    inherits(WorkerObserver, __super__);
    function WorkerObserver(worker) {
      this._worker = worker;
      __super__.call(this);
    }

    WorkerObserver.prototype.next = function (x) { this._worker.postMessage(x); };
    WorkerObserver.prototype.error = function (e) { throw e; };
    WorkerObserver.prototype.completed = function () { };

    return WorkerObserver;
  }(AbstractObserver));

  var WorkerObservable = (function (__super__) {
    inherits(WorkerObservable, __super__);
    function WorkerObservable(worker) {
      this._worker = worker;
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
      this._w.terminate();
      this._w.removeEventListener('message', this._msgFn, false);
      this._w.removeEventListener('error', this._errFn, false);
    };

    WorkerObservable.prototype.subscribeCore = function (o) {
      var messageHandler = createMessageHandler(o);
      var errHandler = createErrHandler(o);

      this._worker.addEventListener('message', messageHandler, false);
      this._worker.addEventListener('error', errHandler, false);

      return new WorkerDisposable(this._worker, messageHandler, errHandler);
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
  dom.fromWebWorker = function (url) {
    if (!root.Worker) { throw new TypeError('Worker not implemented in your runtime.'); }
    var worker = new root.Worker(url);
    return Subject.create(new WorkerObserver(worker), new WorkerObservable(worker));
  };
