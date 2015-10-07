  var FromReaderObservable = (function (__super__) {
    inherits(FromReaderObservable, __super__);
    function FromReaderObservable(readerFn, file, progressObserver, encoding) {
      this._readerFn  = readerFn;
      this._file = file;
      this._progressObserver = progressObserver;
      this._encoding = encoding;
      __super__.call(this);
    }

    function createLoadHandler(o, p) {
      return function loadHandler(e) {
        p && p.onCompleted();
        o.onNext(e.target.result);
        o.onCompleted();
      };
    }

    function createErrorHandler(o) { return function errorHandler (e) { o.onError(e.target.error); }; }
    function createProgressHandler(o) { return function progressHandler (e) { o.onNext(e); }; }

    function FromReaderDisposable(reader, progressObserver, loadHandler, errorHandler, progressHandler) {
      this._r = reader;
      this._po = progressObserver;
      this._lFn = loadHandler;
      this._eFn = errorHandler;
      this._pFn = progressHandler;
      this.isDisposed = false;
    }

    FromReaderDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._r.readyState === root.FileReader.LOADING && this._r.abort();
        this._r.removeEventListener('load', this._lFn, false);
        this._r.removeEventListener('error', this._eFn, false);
        this._po && this._r.removeEventListener('progress', this._pFn, false);
      }
    };

    FromReaderObservable.prototype.subscribeCore = function (o) {
      var reader = new root.FileReader();

      var loadHandler = createLoadHandler(o, this._progressObserver);
      var errorHandler = createErrorHandler(o);
      var progressHandler = createProgressHandler(this._progressObserver);

      reader.addEventListener('load', loadHandler, false);
      reader.addEventListener('error', errorHandler, false);
      this._progressObserver && reader.addEventListener('progress', progressHandler, false);

      reader[this._readerFn](this._file, this._encoding);

      return new FromReaderDisposable(reader, this._progressObserver, loadHandler, errorHandler, progressHandler);
    };

    return FromReaderObservable;
  }(ObservableBase));

  /**
   * The FileReader object lets web applications asynchronously read the contents of
   * files (or raw data buffers) stored on the user's computer, using File or Blob objects
   * to specify the file or data to read as an observable sequence.
   * @param {String} file The file to read.
   * @param {Observer} An observer to watch for progress.
   * @returns {Object} An object which contains methods for reading the data.
   */
  dom.fromReader = function(file, progressObserver) {
    if (!root.FileReader) { throw new TypeError('FileReader not implemented in your runtime.'); }

    return {
      /**
       * This method is used to read the file as an ArrayBuffer as an Observable stream.
       * @returns {Observable} An observable stream of an ArrayBuffer
       */
      asArrayBuffer : function() {
        return new FromReaderObservable('readAsArrayBuffer', file, progressObserver);
      },
      /**
       * This method is used to read the file as a binary data string as an Observable stream.
       * @returns {Observable} An observable stream of a binary data string.
       */
      asBinaryString : function() {
        return new FromReaderObservable('readAsBinaryString', file, progressObserver);
      },
      /**
       * This method is used to read the file as a URL of the file's data as an Observable stream.
       * @returns {Observable} An observable stream of a URL representing the file's data.
       */
      asDataURL : function() {
        return new FromReaderObservable('readAsDataURL', file, progressObserver);
      },
      /**
       * This method is used to read the file as a string as an Observable stream.
       * @returns {Observable} An observable stream of the string contents of the file.
       */
      asText : function(encoding) {
        return new FromReaderObservable('readAsText', file, progressObserver, encoding);
      }
    };
  };
