(function () {
	'use strict';
	/* jshint undef: true, unused: true */
	/* globals QUnit, test, Rx, equal, deepEqual, raises, window */
	var originalWebSocket;

	function noop() { }

	var DOM = Rx.DOM,
		Observer = Rx.Observer;

	QUnit.module('Websocket', {
		beforeEach: function(){
			// mock WebSocket
			originalWebSocket = window.WebSocket;
		},

		afterEach: function(){
			window.WebSocket = originalWebSocket;
		}
	});

	test('Socket does not connect until subscribed to', function () {
		window.WebSocket = MockSocket;

		var socket = DOM.fromWebSocket('endpoint', 'protocol');

		equal(MockSocket.calledWith, undefined);

		var disposable = socket.subscribe(noop);

		deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

		disposable.dispose();
	});

	test('Socket calls WebSocket constructor appropriately for one argument', function(){
		window.WebSocket = MockSocket;

		var socket = DOM.fromWebSocket('endpoint');

		var disposable = socket.subscribe(noop);

		deepEqual(MockSocket.calledWith, ['endpoint']);

		disposable.dispose();
	});


	test('Socket calls WebSocket constructor appropriately for two arguments', function(){
		window.WebSocket = MockSocket;

		var socket = DOM.fromWebSocket('endpoint', 'protocol');

		var disposable = socket.subscribe(noop);

		deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

		disposable.dispose();
	});


	test('Socket calls WebSocket constructor appropriately for three arguments where protocol is null', function(){
		window.WebSocket = MockSocket;

		var obs = Rx.Observer.create(noop);

		var socket = DOM.fromWebSocket('endpoint', null, obs);

		var disposable = socket.subscribe(noop);

		deepEqual(MockSocket.calledWith, ['endpoint']);

		disposable.dispose();
	});


	test('Socket calls WebSocket constructor appropriately for three arguments where protocol is undefined', function(){
		window.WebSocket = MockSocket;

		var obs = Rx.Observer.create(noop);

		var socket = DOM.fromWebSocket('endpoint', null, obs);

		var disposable = socket.subscribe(noop);

		deepEqual(MockSocket.calledWith, ['endpoint']);

		disposable.dispose();
	});


	test('Socket calls WebSocket constructor appropriately for three arguments where protocol is not undefined or null', function(){
		window.WebSocket = MockSocket;

		var obs = Rx.Observer.create(noop);

		var socket = DOM.fromWebSocket('endpoint', 'protocol', obs);

		var disposable = socket.subscribe(noop);

		deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

		disposable.dispose();
	});

	test('should have a hook for just before the underlying socket is closed', function(){
		window.WebSocket = MockSocket;

		var socket;
		var calledNext = false;
		var calledCompleted = false;

		var closingObserver = Observer.create(
			function () {
				equal(typeof socket.closeCalledWith, 'undefined', 'close shouldnt have been called at this point');
				calledNext = true;
			},
			null,
			function() {
				equal(typeof socket.closeCalledWith, 'undefined', 'close shouldnt have been called at this point');
				calledCompleted = true;
			}
		);

		socket = DOM.fromWebSocket('endpoint', null, null, closingObserver);

		var disposable = socket.subscribe(noop);

		equal(typeof MockSocket.closeCalledWith, 'undefined', 'close shouldnt have been called');

		disposable.dispose();

		equal(calledNext, true, 'closingObserver should have been called');
		equal(calledCompleted, true, 'closingObserver should have been called');
		deepEqual(MockSocket.closeCalledWith, []);
	});

	test('onCompleted() should close the underlying socket', function(){
		window.WebSocket = MockSocket;

		var socket = DOM.fromWebSocket('endpoint');

		socket.subscribe(noop);

		equal(typeof MockSocket.closeCalledWith, 'undefined');
		socket.onCompleted();
		deepEqual(MockSocket.closeCalledWith, [1000, '']);
	});

	test('onError("reason") should throw an error saying a code is required', function(){
		window.WebSocket = MockSocket;

		var socket = DOM.fromWebSocket('endpoint');

		socket.subscribe(noop);

		equal(typeof MockSocket.closeCalledWith, 'undefined');
		raises(function () {
			socket.onError('because I am testing this');
		},
		/no code specified/,
		'expected a code to be passed');
	});

	test('onError({ reason: "reason", code: 3001 }) should close the underlying socket with code generic code 3001 and "reason"', function(){
		window.WebSocket = MockSocket;

		var socket = DOM.fromWebSocket('endpoint');

		socket.subscribe(noop);

		equal(typeof MockSocket.closeCalledWith, 'undefined');
		socket.onError({
			reason: 'because I am testing this',
			code: 3001
		});
		deepEqual(MockSocket.closeCalledWith, [3001, 'because I am testing this']);
	});


	function MockSocket() {
		MockSocket.calledWith = [].slice.call(arguments);
		MockSocket.closeCalledWith = undefined;
	}

	MockSocket.prototype = {
		close: function(){
			MockSocket.closeCalledWith = [].slice.call(arguments);
		},
		addEventListener: function(){},
		removeEventListener: function(){}
	};
}());
