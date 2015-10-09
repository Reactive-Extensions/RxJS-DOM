(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  QUnit.module('FromEvent');

  var Observable = Rx.Observable,
      slice = Array.prototype.slice;

  /** Fake DOM Element */
  function MockEventTarget(nodeName) {
    this.listeners = {};
    this.nodeName = nodeName;
  }

  MockEventTarget.prototype.addEventListener = function (eventName, handler, useCapture) {
    this.listeners[eventName] || (this.listeners[eventName] = []);
    this.listeners[eventName].push({ handler: handler, useCapture: useCapture });
  };

  MockEventTarget.prototype.removeEventListener = function (eventName, handler, useCapture) {
    var idx = -1;
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        var e = this.listeners[eventName][i];
        if (e.handler === handler && e.useCapture === useCapture) {
          idx = i;
          break;
        }
      }

      idx !== -1 && this.listeners[eventName].splice(idx, 1);
    }
  };

  MockEventTarget.prototype.trigger = function (eventName) {
    var args = slice.call(arguments, 1);
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        this.listeners[eventName][i].handler.apply(null, args);
      }
    }
  };

  var DOM = Rx.DOM,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError;

  test('Event all hit', function () {
    var element = new MockEventTarget('foo');

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromEvent(element, 'someEvent'); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { element.trigger('someEvent', 1); });
    scheduler.scheduleAbsolute(null, 400, function () { element.trigger('someEvent', 2); });
    scheduler.scheduleAbsolute(null, 500, function () { element.trigger('someEvent', 3); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(400, 2),
      onNext(500, 3)
    );
  });

  test('Event some miss', function () {
    var element = new MockEventTarget('foo');

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromEvent(element, 'someEvent'); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { element.trigger('someEvent', 1); });
    scheduler.scheduleAbsolute(null, 400, function () { element.trigger('anotherEvent', 2); });
    scheduler.scheduleAbsolute(null, 500, function () { element.trigger('anotherEvent', 3); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(300, 1)
    );
  });

  test('Event with selector', function () {
    var element = new MockEventTarget('foo');

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () {
      source = DOM.fromEvent(element, 'someEvent', function (baz, quux) {
        return { foo: baz, bar: quux };
      });
    });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { element.trigger('someEvent', 1, 2); });
    scheduler.scheduleAbsolute(null, 400, function () { element.trigger('someEvent', 3, 4); });
    scheduler.scheduleAbsolute(null, 500, function () { element.trigger('someEvent', 5, 6); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(300, {foo: 1, bar: 2}),
      onNext(400, {foo: 3, bar: 4}),
      onNext(500, {foo: 5, bar: 6})
    );
  });

  test('Event with selector throws', function () {
    var error = new Error();

    var element = new MockEventTarget('foo');

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () {
      source = DOM.fromEvent(element, 'someEvent', function () {
        throw error;
      });
    });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { element.trigger('someEvent', 1, 2); });
    scheduler.scheduleAbsolute(null, 400, function () { element.trigger('someEvent', 3, 4); });
    scheduler.scheduleAbsolute(null, 500, function () { element.trigger('someEvent', 5, 6); });

    scheduler.start();

    results.messages.assertEqual(
      onError(300, error)
    );
  });

}());
