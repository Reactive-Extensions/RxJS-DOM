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

    function _fromReader(readerFn, file, encoding) {
      return new AnonymousObservable(function(observer) {
        var reader = new root.FileReader();
        var subject = new AsyncSubject();

        function loadHandler(e) {
          progressObserver && progressObserver.onCompleted();
          subject.onNext(e.target.result);
          subject.onCompleted();
        }

        function errorHandler(e) {
          subject.onError(e.target.error);
        }

        function progressHandler(e) {
          progressObserver.onNext(e);
        }

        reader.addEventListener('load', loadHandler, false);
        reader.addEventListener('error', errorHandler, false);
        progressObserver && reader.addEventListener('progress', progressHandler, false);

        reader[readerFn](file, encoding);

        return new CompositeDisposable(subject.subscribe(observer), disposableCreate(function () {
          reader.readyState == root.FileReader.LOADING && reader.abort();
          reader.removeEventListener('load', loadHandler, false);
          reader.removeEventListener('error', errorHandler, false);
          progressObserver && reader.removeEventListener('progress', progressHandler, false);
        }));
      });
    }

    return {
      /**
       * This method is used to read the file as an ArrayBuffer as an Observable stream.
       * @returns {Observable} An observable stream of an ArrayBuffer
       */
      asArrayBuffer : function() {
        return _fromReader('readAsArrayBuffer', file);
      },
      /**
       * This method is used to read the file as a binary data string as an Observable stream.
       * @returns {Observable} An observable stream of a binary data string.
       */
      asBinaryString : function() {
        return _fromReader('readAsBinaryString', file);
      },
      /**
       * This method is used to read the file as a URL of the file's data as an Observable stream.
       * @returns {Observable} An observable stream of a URL representing the file's data.
       */
      asDataURL : function() {
        return _fromReader('readAsDataURL', file);
      },
      /**
       * This method is used to read the file as a string as an Observable stream.
       * @returns {Observable} An observable stream of the string contents of the file.
       */
      asText : function(encoding) {
        return _fromReader('readAsText', file, encoding);
      }
    };
  };
