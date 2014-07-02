  if (!!root.Worker) {
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
      var worker = new root.Worker(url);

      var observable = new AnonymousObservable(function (obs) {
        worker.onmessage = function (data) {
          obs.onNext(data);
        };

        worker.onerror = function (err) {
          obs.onError(err);
        };

        return function () {
          worker.close();
        };
      });

      var observer = observerCreate(function (data) {
        worker.postMessage(data);
      });

      return Subject.create(observer, observable);
    };      
  }