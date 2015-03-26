  /** @private
   * Destroys the current element
   */
  var destroy = (function () {
    var trash = document.createElement('div');
    return function (element) {
      trash.appendChild(element);
      trash.innerHTML = '';
    };
  })();

  /**
   * Creates an observable JSONP Request with the specified settings.
   *
   * @example
   *   source = Rx.DOM.jsonpRequest('http://www.bing.com/?q=foo&JSONPCallback=?');
   *   source = Rx.DOM.jsonpRequest( url: 'http://bing.com/?q=foo', jsonp: 'JSONPCallback' });
   *
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
   dom.jsonpRequest = (function() {
     var id = 0;

     return function(options) {
       return new AnonymousObservable(function(observer) {

         var callbackId = 'callback_' + (id++).toString(36);

         var settings = {
           jsonp: 'JSONPCallback',
           async: true,
           jsonpCallback: 'rxjsjsonpCallbacks' + callbackId
         };

         if(typeof options === 'string') {
           settings.url = options;
         } else {
           for(var prop in options) {
             if(hasOwnProperty.call(options, prop)) {
               settings[prop] = options[prop];
             }
           }
         }

         var script = document.createElement('script');
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
             observer.onNext({
               status: status,
               responseType: 'jsonp',
               response: data,
               originalEvent: e
             });

             observer.onCompleted();
           }
           else {
             observer.onError({
               type: 'error',
               status: status,
               originalEvent: e
             });
           }
         };

         script.onload = script.onreadystatechanged = script.onerror = handler;

         var head = document.getElementsByTagName('head')[0] || document.documentElement;
         head.insertBefore(script, head.firstChild);

         return function() {
           script.onload = script.onreadystatechanged = script.onerror = null;
           destroy(script);
           script = null;
         };
       });
     }
   }());
