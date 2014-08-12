  /** 
   * Creates an observable sequence when the DOM is loaded
   * @returns {Observable} An observable sequence fired when the DOM is loaded
   */
  dom.ready = function () {
    return new AnonymousObservable(function (observer) {
      function handler () {
        observer.onNext();
        observer.onCompleted();
      }

      if (document.readyState === 'complete') {
        handler();
      } else {
        document.addEventListener( 'DOMContentLoaded', handler, false );
        root.addEventListener( 'load', handler, false );
      }

      return function () {
        document.removeEventListener( 'DOMContentLoaded', handler, false );
        root.removeEventListener( 'load', handler, false );
      };
    }).publish().refCount();
  };
