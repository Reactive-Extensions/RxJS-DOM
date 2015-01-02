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

	var disposeable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

	disposeable.dispose();
});

test('Socket calls WebSocket constructor appropriately for one argument', function(){
	window.WebSocket = MockSocket;

	var socket = Rx.DOM.fromWebSocket('endpoint');

	var disposeable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint']);

	disposeable.dispose();
});


test('Socket calls WebSocket constructor appropriately for two arguments', function(){
	window.WebSocket = MockSocket;

	var socket = Rx.DOM.fromWebSocket('endpoint', 'protocol');

	var disposeable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

	disposeable.dispose();
});


test('Socket calls WebSocket constructor appropriately for three arguments where protocol is null', function(){
	window.WebSocket = MockSocket;

	var obs = Rx.Observer.create(function() {});

	var socket = Rx.DOM.fromWebSocket('endpoint', null, obs);

	var disposeable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint']);

	disposeable.dispose();
});


test('Socket calls WebSocket constructor appropriately for three arguments where protocol is undefined', function(){
	window.WebSocket = MockSocket;

	var obs = Rx.Observer.create(function() {});

	var socket = Rx.DOM.fromWebSocket('endpoint', undefined, obs);

	var disposeable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint']);

	disposeable.dispose();
});


test('Socket calls WebSocket constructor appropriately for three arguments where protocol is not undefined or null', function(){
	window.WebSocket = MockSocket;

	var obs = Rx.Observer.create(function() {});

	var socket = Rx.DOM.fromWebSocket('endpoint', 'protocol', obs);

	var disposeable = socket.subscribe(function() {});

	deepEqual(MockSocket.calledWith, ['endpoint', 'protocol']);

	disposeable.dispose();
});

function MockSocket() {
	MockSocket.calledWith = [].slice.call(arguments);
}


MockSocket.prototype = {
	close: function(){},
	addEventListener: function(){},
	removeEventListener: function(){}
};