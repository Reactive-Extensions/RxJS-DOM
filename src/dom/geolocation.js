  var CurrentPositionObservable = (function (__super__) {
    inherits(CurrentPositionObservable, __super__);
    function CurrentPositionObservable(opts) {
      this._opts = opts;
      __super__.call(this);
    }

    CurrentPositionObservable.prototype.subscribeCore = function (o) {
      root.navigator.geolocation.getCurrentPosition(
        function (data) {
          o.onNext(data);
          o.onCompleted();
        },
        function (e) { o.onError(e); },
        this._opts);
    };

    return CurrentPositionObservable;
  }(ObservableBase));

  var WatchPositionObservable = (function (__super__) {
    inherits(WatchPositionObservable, __super__);
    function WatchPositionObservable(opts) {
      this._opts = opts;
      __super__.call(this);
    }

    function WatchPositionDisposable(id) {
      this._id = id;
      this.isDisposed = false;
    }

    WatchPositionDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        root.navigator.geolocation.clearWatch(this._id);
      }
    };

    WatchPositionObservable.prototype.subscribeCore = function (o) {
      var watchId = root.navigator.geolocation.watchPosition(
        function (x) { o.onNext(x); },
        function (e) { o.onError(e); },
        this._opts);

      return new WatchPositionDisposable(watchId);
    };

    return WatchPositionObservable;
  }(ObservableBase));

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
      if (!root.navigator && !root.navigation.geolocation) { throw new TypeError('geolocation not available'); }
      return new CurrentPositionObservable(geolocationOptions);
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
      if (!root.navigator && !root.navigation.geolocation) { throw new TypeError('geolocation not available'); }
      return new WatchPositionObservable(geolocationOptions).publish().refCount();
    }
  };
