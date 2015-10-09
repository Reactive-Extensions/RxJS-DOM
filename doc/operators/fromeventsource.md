### `Rx.DOM.fromEventSource(url, [openObserver])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/dom/eventsource.js "View in source")

This method wraps an EventSource as an observable sequence which is used to send server-side events.  Note that your browser must support EventSource objects.

#### Arguments
1. `url` *(String)*: The URL of the Server-Side Events.
3. `[openObserver]` *(`Rx.Observer`)*: An optional Observer to capture the open event.

#### Returns
*(`Observable`)*: An observable sequence which represents the data from a server-side event.

#### Example
```js
// Not handling the open event
var source = Rx.DOM.fromEventSource('foo.php');

source.subscribe(function (e) {
  console.log('Received data: %s', e.data);
});

// Using an observer for the open
var observer = Rx.Observer.create(function (e) {
  console.log('Opening');
});

var source = Rx.DOM.fromEventSource('foo.php', observer);

source.subscribe(function (e) {
  console.log('Received data: ' + e.data);
});
```

### Location

File:
- [`/src/dom/eventsource.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/dom/eventsource.js)

Dist:
- [`rx.dom.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/dist/rx.dom.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) |  [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)

NPM Packages:
- [`rx-dom`](https://preview.npmjs.com/package/rx-dom)

NuGet Packages:
- [`RxJS-Bridges-HTML`](http://www.nuget.org/packages/RxJS-Bridges-HTML/)

Unit Tests:
- [`/tests/dom/tests.eventsource.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/tests/dom/tests.eventsource.js)
