  /**
   * Creates an observable sequence when the DOM is loaded
   * @returns {Observable} An observable sequence fired when the DOM is loaded
   */
  dom.ready = function () {
    return new AnonymousObservable(function (observer) {
      var addedHandlers = false;

      function handler () {
        observer.onNext();
        observer.onCompleted();
      }

      if (root.document.readyState === 'complete') {
        setTimeout(handler, 0);
      } else {
        addedHandlers = true;
        root.document.addEventListener( 'DOMContentLoaded', handler, false );
        root.addEventListener( 'load', handler, false );
      }

      return function () {
        if (!addedHandlers) { return; }
        root.document.removeEventListener( 'DOMContentLoaded', handler, false );
        root.removeEventListener( 'load', handler, false );
      };
    });
  };
