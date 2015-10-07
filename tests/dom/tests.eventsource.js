(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, window */
  var originalEventSource;
  var eventSource;

  function Emitter() {
    this.listeners = {};
    this.isClosed = false;
    eventSource = this;
  }

  Emitter.CONNECTING = 0;
  Emitter.OPEN = 1;
  Emitter.CLOSED = 2;

  Emitter.prototype.addEventListener = function (eventName, handler) {
    this.listeners[eventName] || (this.listeners[eventName] = []);
    this.listeners[eventName].push(handler);
  };

  Emitter.prototype.removeEventListener = function (eventName, handler) {
    var idx = -1;
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        if (handler === this.listeners[eventName][i]) {
          idx = i;
          break;
        }
      }

      idx !== -1 && this.listeners[eventName].splice(idx, 1);
    }
  };

  Emitter.prototype.emit = function (eventName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        this.listeners[eventName][i].apply(null, args);
      }
    }
  };

  Emitter.prototype.close = function () {
    this.isClosed = true;
  };

  QUnit.module('FileReader', {
    beforeEach : function() {
      originalEventSource = window.EventSource;
    },
    afterEach : function() {
      window.EventSource = originalEventSource;
    }
  });

  var DOM = Rx.DOM,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('EventSource with open observer', function () {
    window.EventSource = Emitter;

    var scheduler = new TestScheduler();

    var openObserver = scheduler.createObserver();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromEventSource('url', openObserver); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { eventSource.emit('open', true); });

    scheduler.start();

    openObserver.messages.assertEqual(
      onNext(300, true),
      onCompleted(300)
    );
  });

  test('EventSource with messages', function () {
    window.EventSource = Emitter;

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromEventSource('url'); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 400, function () { eventSource.emit('message', {data: 1}); });
    scheduler.scheduleAbsolute(null, 500, function () { eventSource.emit('message', {data: 2}); });
    scheduler.scheduleAbsolute(null, 600, function () { eventSource.emit('message', {data: 3}); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(400, 1),
      onNext(500, 2),
      onNext(600, 3)
    );
  });

  test('EventSource with close', function () {
    window.EventSource = Emitter;

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    var message = { readyState: Emitter.CLOSED, status: 200 };

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromEventSource('url'); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 400, function () { eventSource.emit('message', {data: 1}); });
    scheduler.scheduleAbsolute(null, 500, function () { eventSource.emit('message', {data: 2}); });
    scheduler.scheduleAbsolute(null, 600, function () { eventSource.emit('message', {data: 3}); });
    scheduler.scheduleAbsolute(null, 700, function () { eventSource.emit('error', message); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(400, 1),
      onNext(500, 2),
      onNext(600, 3),
      onCompleted(700)
    );
  });

  test('EventSource with error', function () {
    window.EventSource = Emitter;

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    var message = { readyState: Emitter.CONNECTING, status: 401 };

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromEventSource('url'); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 400, function () { eventSource.emit('message', {data: 1}); });
    scheduler.scheduleAbsolute(null, 500, function () { eventSource.emit('message', {data: 2}); });
    scheduler.scheduleAbsolute(null, 600, function () { eventSource.emit('message', {data: 3}); });
    scheduler.scheduleAbsolute(null, 700, function () { eventSource.emit('error', message); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(400, 1),
      onNext(500, 2),
      onNext(600, 3),
      onError(700, message)
    );
  });
}());
