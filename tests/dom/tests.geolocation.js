(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, window */
  var original;

  QUnit.module('Geolocation', {
    beforeEach : function() {
      original = window.navigator.geolocation;
    },
    afterEach : function() {
      window.navigator.geolocation = original;
    }
  });

  var mockGeolocation = {
    initGetCurrentPosition: function (successData, errorData) {
      this._sucessData = null;
      this._errorData = null;
      this._successData = successData;
      this._errorData = errorData;
    },
    getCurrentPosition: function (success, error) {
      if (this._errorData) {
        error(this._errorData);
      } else {
        success(this._successData);
      }
    },
    watchPosition: function (success, error) {
      this._watchSuccess = success;
      this._watchError = error;
      return 42;
    },
    clearWatch: function (id) {
      this._clearWatchId = id;
    },
    triggerWatchPosition: function (successData, errorData) {
      if (errorData) {
        this._watchError(errorData);
      } else {
        this._watchSuccess(successData);
      }
    }
  };

  var DOM = Rx.DOM,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('getCurrentPosition success', function () {
    window.navigator.geolocation = mockGeolocation;
    mockGeolocation.initGetCurrentPosition(42);

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.geolocation.getCurrentPosition(); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(200, 42),
      onCompleted(200)
    );
  });

  test('getCurrentPosition error', function () {
    var error = new Error();
    window.navigator.geolocation = mockGeolocation;
    mockGeolocation.initGetCurrentPosition(null, error);

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.geolocation.getCurrentPosition(); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.start();

    results.messages.assertEqual(
      onError(200, error)
    );
  });

  test('watchPosition success', function () {
    window.navigator.geolocation = mockGeolocation;

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.geolocation.watchPosition(); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { mockGeolocation.triggerWatchPosition(42); });
    scheduler.scheduleAbsolute(null, 400, function () { mockGeolocation.triggerWatchPosition(56); });
    scheduler.scheduleAbsolute(null, 500, function () { mockGeolocation.triggerWatchPosition(78); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(300, 42),
      onNext(400, 56),
      onNext(500, 78)
    );

    equal(mockGeolocation._clearWatchId, 42);
  });

  test('watchPosition error', function () {
    var error = new Error();
    window.navigator.geolocation = mockGeolocation;

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.geolocation.watchPosition(); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { mockGeolocation.triggerWatchPosition(42); });
    scheduler.scheduleAbsolute(null, 400, function () { mockGeolocation.triggerWatchPosition(56); });
    scheduler.scheduleAbsolute(null, 500, function () { mockGeolocation.triggerWatchPosition(null, error); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(300, 42),
      onNext(400, 56),
      onError(500, error)
    );

    equal(mockGeolocation._clearWatchId, 42);
  });

}());
