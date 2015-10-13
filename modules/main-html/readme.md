# RxJS DOM HTMl5 Module #

This project provides Reactive Extensions for JavaScript (RxJS) bindings for HTML DOM objects to abstract over Web Sockets, Web Workers, Server-Sent Events, Geolocation, MutationObservers and more using RxJS.  

## Details ##

Files:
- [`rx.dom.html.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/modules/main-html/rx.dom.html.js)

NPM Packages:
- [`rx-dom-html`](https://www.npmjs.com/package/rx-dom-html)

## API ##

#### Server-Sent Events
- [`Rx.DOM.fromEventSource`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromeventsource.md)

#### Web Sockets

- [`Rx.DOM.fromWebSocket`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromwebsocket.md)

#### Web Workers

- [`Rx.DOM.fromWorker`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromworker.md)

#### Mutation Observers

- [`Rx.DOM.fromMutationObserver`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/frommutationobserver.md)

#### Geolocation

- [`Rx.DOM.geolocation.getCurrentPosition`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/getcurrentposition.md)
- [`Rx.DOM.geolocation.watchPosition`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/watchposition.md)

#### [`FileReader`](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

- [`Rx.DOM.fromReader`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromreader.md)
