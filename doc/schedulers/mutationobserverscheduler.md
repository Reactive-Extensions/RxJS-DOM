### `Rx.Scheduler.mutationObserver`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/mutationobserverscheduler.js "View in source") 

Gets an `Rx.Scheduler` that schedules schedules work on the `window.MutationObserver` for immediate actions.  This requires `window.MutationObserver` to be supported on your browser.

#### Example
```js
var obs = Rx.Observable.return(
  42, 
  Rx.Scheduler.mutationObserver);

obs.subscribe(function (x) {
  // Scheduled using a MutationObserver
  console.log(x);
});

// => 42
```

### Location

File:
- [`/src/mutationobserverscheduler.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/mutationobserverscheduler.js)

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
- [`/tests/tests.mutationobserverscheduler.js](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/tests/tests.mutationobserverscheduler.js)