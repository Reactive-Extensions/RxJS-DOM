# RxJS Lite DOM Module #

This project provides Reactive Extensions for JavaScript (RxJS) bindings for HTML DOM objects to abstract over the event binding, Ajax requests, Web Sockets, Web Workers, Server-Sent Events, Geolocation and more using RxJS Lite.  

## Details ##

Files:
- [`rx.lite.dom.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/modules/lite/rx.lite.dom.js)

NPM Packages:
- [`rx-lite-dom`](https://www.npmjs.com/package/rx-lite-dom)

## API ##

### Events

- [`Rx.DOM.fromEvent`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromevent.md)
- [`Rx.DOM.ready`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ready.md)

### Event Shortcuts

- [`Rx.DOM.blur`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/blur.md)
- [`Rx.DOM.change`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/change.md)
- [`Rx.DOM.click`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/click.md)
- [`Rx.DOM.contextmenu`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/contextmenu.md)
- [`Rx.DOM.dblclick`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/dblclick.md)
- [`Rx.DOM.error`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/error.md)
- [`Rx.DOM.focus`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/focus.md)
- [`Rx.DOM.focusin`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/focusin.md)
- [`Rx.DOM.focusout`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/focusout.md)
- [`Rx.DOM.input`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/input.md)
- [`Rx.DOM.keydown`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/keydown.md)
- [`Rx.DOM.keypress`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/keypress.md)
- [`Rx.DOM.keyup`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/keyup.md)
- [`Rx.DOM.load`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/load.md)
- [`Rx.DOM.mousedown`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/mousedown.md)
- [`Rx.DOM.mouseenter`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/mouseenter.md)
- [`Rx.DOM.mouseleave`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/mouseleave.md)
- [`Rx.DOM.mousemove`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/mousemove.md)
- [`Rx.DOM.mouseout`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/mouseout.md)
- [`Rx.DOM.mouseover`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/mouseover.md)
- [`Rx.DOM.mouseup`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/mouseup.md)
- [`Rx.DOM.resize`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/resize.md)
- [`Rx.DOM.scroll`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/scroll.md)
- [`Rx.DOM.select`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/select.md)
- [`Rx.DOM.submit`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/submit.md)
- [`Rx.DOM.unload`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/unload.md)

### Pointer Events (If supported by your browser)

- [`Rx.DOM.pointerdown`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/pointerdown.md)
- [`Rx.DOM.pointerenter`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/pointerenter.md)
- [`Rx.DOM.pointerleave`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/pointerleave.md)
- [`Rx.DOM.pointermove`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/pointermove.md)
- [`Rx.DOM.pointerout`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/pointerout.md)
- [`Rx.DOM.pointerover`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/pointerover.md)
- [`Rx.DOM.pointerup`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/pointerup.md)

### Touch Events (If supported by your browser)

- [`Rx.DOM.touchcancel`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/touchcancel.md)
- [`Rx.DOM.touchend`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/touchend.md)
- [`Rx.DOM.touchmove`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/touchmove.md)
- [`Rx.DOM.touchstart`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/touchstart.md)

### Ajax

- [`Rx.DOM.ajax`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ajax.md)
- [`Rx.DOM.get`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/get.md)
- [`Rx.DOM.getJSON`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/getjson.md)
- [`Rx.DOM.post`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/post.md)
- [`Rx.DOM.jsonpRequest`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/jsonprequest.md)

### Server-Sent Events
- [`Rx.DOM.fromEventSource`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromeventsource.md)

### Web Sockets

- [`Rx.DOM.fromWebSocket`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromwebsocket.md)

### Web Workers

- [`Rx.DOM.fromWorker`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromworker.md)

### Mutation Observers

- [`Rx.DOM.fromMutationObserver`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/frommutationobserver.md)

### Geolocation

- [`Rx.DOM.geolocation.getCurrentPosition`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/getcurrentposition.md)
- [`Rx.DOM.geolocation.watchPosition`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/watchposition.md)

### Schedulers

- [`Rx.Scheduler.requestAnimationFrame`](schedulers/requestanimationframe.md)
- [`Rx.Scheduler.microtask`](schedulers/microtaskscheduler.md)

### [`FileReader`](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

- [`Rx.DOM.fromReader`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/fromreader.md)
