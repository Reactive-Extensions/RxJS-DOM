### `Rx.DOM.fromWebSocket(url, protocol, [observerOrOnNext])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/websocket.js "View in source") 

Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.

#### Arguments
1. `url` *(String)*: The URL of the WebSocket.
2. `protocol` *(String)*: The protocol of the WebSocket.
3. `[observerOrOnNext]` *(`Rx.Observer` | `Function`)*: An optional Observer or onNext function to capture the open event.

#### Returns
*(`Subject`)*: A Subject which wraps a WebSocket.

#### Example
```js
// Using a function for the open
var socket = Rx.DOM.fromWebSocket(
  'http://localhost:8080', 
  'protocol', 
  function (e) {
    console.log('Opening');
  })

socket.subscribe(function (next) {
  console.log('Received data: ' + next);
});

socket.onNext('data');

// Using an observer for the open
var observer = Rx.Observer.create(function (e) {
  console.log('Opening');
});

var socket = Rx.DOM.fromWebSocket(
  'http://localhost:8080', 'protocol', observer)

socket.subscribe(function (next) {
  console.log('Received data: ' + next);
});

socket.onNext('data');
```

### Location

File:
- [`/src/websocket.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/websocket.js)

Dist:
- [`rx.dom.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/dist/rx.dom.js) | - [`rx.dom.compat.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/dist/rx.dom.compat.js)

Prerequisites:
- If using `rx.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
  - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx-dom`](https://preview.npmjs.com/package/rx-dom)

NuGet Packages:
- [`RxJS-Bridges-HTML`](http://www.nuget.org/packages/RxJS-Bridges-HTML/)

Unit Tests:
- [`/tests/tests.websocket.js](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/tests/tests.fromwebsocket.js)
