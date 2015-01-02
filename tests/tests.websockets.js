var originalWebSocket;

module('Websocket', {
	beforeEach: function(){
		// mock WebSocket
		originalWebSocket = window.WebSocket;
	},

	afterEach: function(){
		window.WebSocket = originalWebSocket;
	}
});

test('Socket does not connect until subscribed to', function(){
	window.WebSocket = MockSocket;

	var socket = Rx.DOM.fromWebSocket('endpoint', 'protocol');

	equal(MockSocket.calledWith, undefined);

	var disposable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

	disposable.dispose();
});

test('Socket calls WebSocket constructor appropriately for one argument', function(){
	window.WebSocket = MockSocket;

	var socket = Rx.DOM.fromWebSocket('endpoint');

	var disposable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint']);

	disposable.dispose();
});


test('Socket calls WebSocket constructor appropriately for two arguments', function(){
	window.WebSocket = MockSocket;

	var socket = Rx.DOM.fromWebSocket('endpoint', 'protocol');

	var disposable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

	disposable.dispose();
});


test('Socket calls WebSocket constructor appropriately for three arguments where protocol is null', function(){
	window.WebSocket = MockSocket;

	var obs = Rx.Observer.create(function() {});

	var socket = Rx.DOM.fromWebSocket('endpoint', null, obs);

	var disposable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint']);

	disposable.dispose();
});


test('Socket calls WebSocket constructor appropriately for three arguments where protocol is undefined', function(){
	window.WebSocket = MockSocket;

	var obs = Rx.Observer.create(function() {});

	var socket = Rx.DOM.fromWebSocket('endpoint', undefined, obs);

	var disposable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint']);

	disposable.dispose();
});


test('Socket calls WebSocket constructor appropriately for three arguments where protocol is not undefined or null', function(){
	window.WebSocket = MockSocket;

	var obs = Rx.Observer.create(function() {});

	var socket = Rx.DOM.fromWebSocket('endpoint', 'protocol', obs);

	var disposable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

	disposable.dispose();
});

test('should have a hook for just before the underlying socket is closed', function(){
	window.WebSocket = MockSocket;

	var socket;
	var calledNext = false;
	var calledCompleted = false;

	var closingObserver = Rx.Observer.create(function(x) {
		equal(typeof socket.closeCalledWith, 'undefined', 'close shouldnt have been called at this point');
		calledNext = true;
	}, null, function(){
		equal(typeof socket.closeCalledWith, 'undefined', 'close shouldnt have been called at this point');
		calledCompleted = true;
	});

	socket = Rx.DOM.fromWebSocket('endpoint', null, null, closingObserver);

	var disposable = socket.subscribe(function(){});

	equal(typeof MockSocket.closeCalledWith, 'undefined', 'close shouldnt have been called');

	disposable.dispose();

	equal(calledNext, true, 'closingObserver should have been called');
	equal(calledCompleted, true, 'closingObserver should have been called');
	equal(!!MockSocket.closeCalledWith, true);
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