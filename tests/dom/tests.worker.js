(function () {
  'use strict';
	/* jshint undef: true, unused: true */
	/* globals QUnit, test, equal, Rx, window */
	var original, worker;

  function MockWorker(url) {
    this.url = url;
    this.listeners = {};
    this.isTerminated = false;
    worker = this;
  }

  MockWorker.prototype.addEventListener = function (eventName, handler) {
    this.listeners[eventName] || (this.listeners[eventName] = []);
    this.listeners[eventName].push(handler);
  };

  MockWorker.prototype.removeEventListener = function (eventName, handler) {
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

  MockWorker.prototype.emit = function (eventName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        this.listeners[eventName][i].apply(null, args);
      }
    }
  };

  MockWorker.prototype.postMessage = function (data) {
    var listeners = this.listeners['message'];
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i](data);
    }
  };

  MockWorker.prototype.terminate = function () {
    this.isTerminated = true;
  };

	var DOM = Rx.DOM,
      TestScheduler = Rx.TestScheduler,
      Observer = Rx.Observer,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

	QUnit.module('Websocket', {
		beforeEach: function(){
			// mock WebSocket
			original = window.Worker;
		},

		afterEach: function(){
			window.Worker = original;
		}
	});

  test('Worker not created until subscribe', function () {
    window.Worker = MockWorker;

    var source = Rx.DOM.fromWorker('someurl');

    equal(worker, undefined);

    source.subscribe(Observer.create());

    equal(worker.url, 'someurl');
  });

  test('Worker echoes with success', function () {
    window.Worker = MockWorker;

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromWorker('someurl'); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { worker.postMessage(1); });
    scheduler.scheduleAbsolute(null, 400, function () { worker.postMessage(2); });
    scheduler.scheduleAbsolute(null, 500, function () { worker.postMessage(3); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(400, 2),
      onNext(500, 3)
    );

    equal(worker.isTerminated, true);
  });

  test('Worker echoes with error', function () {
    var error = new Error();

    window.Worker = MockWorker;

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromWorker('someurl'); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { worker.postMessage(1); });
    scheduler.scheduleAbsolute(null, 400, function () { worker.postMessage(2); });
    scheduler.scheduleAbsolute(null, 500, function () { worker.emit('error', error); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(400, 2),
      onError(500, error)
    );

    equal(worker.isTerminated, true);
  });
}());
