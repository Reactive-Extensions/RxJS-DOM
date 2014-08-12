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

      function createListener() {
        if (document.addEventListener) {
          document.addEventListener( "DOMContentLoaded", handler, false );
          root.addEventListener( "load", handler, false );
          return function () {
            document.removeEventListener( "DOMContentLoaded", handler, false );
            root.removeEventListener( "load", handler, false );
          };       
        } else if (document.attachEvent) {
          document.attachEvent( "onDOMContentLoaded", handler, false );
          root.attachEvent( "onload", handler, false );  
          return function () {
            document.attachEvent( "DOMContentLoaded", handler );
            root.attachEvent( "load", handler );
          };                          
        } else {
          document['onload'] = handler;  
          root.['onDOMContentLoaded'] = handler;  
          return function () {
            document['onload'] = null;  
            root.['onDOMContentLoaded'] = null;  
          };
        }        
      }

      var returnFn = noop;
      if (document.readyState === "complete") {
        handler();
      } else {
        returnFn = createListener();
      }

      return returnFn;
    }).publish().refCount();
  };