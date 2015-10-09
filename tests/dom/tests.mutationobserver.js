(function () {
  'use strict';
	/* jshint undef: true, unused: true */
	/* globals QUnit, test, equal, Rx, window */
  var original, mutationObserver;

  function MockMutationObserver(next) {
    this._next = next;
    this._connected = false;
    mutationObserver = this;
  }

  MockMutationObserver.prototype.observe = function (target, options) {
    this._target = target;
    this._options = options;
    this._connected = true;
  };

  MockMutationObserver.prototype.disconnect = function () {
    this._connected = false;
  };

  MockMutationObserver.prototype.trigger = function (data) {
    this._next(data);
  };

  QUnit.module('Websocket', {
		beforeEach: function(){
			// mock WebSocket
			original = window.MutationObserver;
		},

		afterEach: function(){
			window.MutationObserver = original;
		}
	});

  var DOM = Rx.DOM,
      Observer = Rx.Observer,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext;

  test('MutationObserver not created until subscribe', function () {
    window.MutationObserver = MockMutationObserver;

    var source = Rx.DOM.fromMutationObserver('foo', 'bar');

    equal(mutationObserver, undefined);

    var d = source.subscribe(Observer.create());

    equal(mutationObserver._target, 'foo');
    equal(mutationObserver._options, 'bar');
    equal(mutationObserver._connected, true);

    d.dispose();

    equal(mutationObserver._connected, false);
  });

  test('MutationObserver fires values on change', function () {
    window.MutationObserver = MockMutationObserver;

    var scheduler = new TestScheduler();

    var source, subscription;
    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () { source = DOM.fromMutationObserver('foo'); });
    scheduler.scheduleAbsolute(null, 200, function () { subscription = source.subscribe(results); });
    scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

    scheduler.scheduleAbsolute(null, 300, function () { mutationObserver.trigger(1); });
    scheduler.scheduleAbsolute(null, 400, function () { mutationObserver.trigger(2); });
    scheduler.scheduleAbsolute(null, 500, function () { mutationObserver.trigger(3); });

    scheduler.start();

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(400, 2),
      onNext(500, 3)
    );
  });
}());
