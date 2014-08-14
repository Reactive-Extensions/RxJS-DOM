  if ('navigator' in root && 'geolocation' in root.navigator) {
    Rx.DOM.geolocation = {

      /**
       * Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
      * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
      *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
      *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
      *              If timeout is Infinity, (the default value) the location request will not time out.
      *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
      *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
      *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
      *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
      *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
      * @returns {Observable} An observable sequence with the geographical location of the device running the client.
      */
      getCurrentPosition: function (geolocationOptions) {
        return new AnonymousObservable(function (observer) {
          root.navigator.geolocation.getCurrentPosition(
            observer.onNext.bind(observer), 
            observer.onError.bind(observer), 
            geolocationOptions);
        });
      },

      /**
      * Begins listening for updates to the current geographical location of the device running the client.
      * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
      *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
      *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
      *              If timeout is Infinity, (the default value) the location request will not time out.
      *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
      *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
      *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
      *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
      *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
      * @returns {Observable} An observable sequence with the current geographical location of the device running the client.
      */ 
      watchPosition: function (geolocationOptions) {
        return new AnonymousObservable(function (observer) {
          var watchId = root.navigator.geolocation.watchPosition(
            observer.onNext.bind(observer), 
            observer.onError.bind(observer), 
            geolocationOptions);

          return function () {
            root.navigator.geolocation.clearWatch(watchId);
          };
        }).publish().refCount();
      }
    }
  }
