(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, window */
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
        return error(this._errorData);
      }
      return success(this._successData);
    }
  };

  var DOM = Rx.DOM,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('watchPosition success', function () {
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

  test('watchPosition error', function () {
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

}());
