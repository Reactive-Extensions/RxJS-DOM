# RxJS Lite DOM Concurrency Module #

This project provides Reactive Extensions for JavaScript (RxJS) bindings for HTML DOM objects to abstract over the DOM scheduling using `requestAnimationFrame` and `MutationObserver` using RxJS Lite.

## Details ##

Files:
- [`rx.lite.dom.concurrency.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/modules/lite-concurrency/rx.lite.dom.concurrency.js)

NPM Packages:
- [`rx-lite-dom-concurrency`](https://www.npmjs.com/package/rx-lite-dom-concurrency)

## API ##

### Schedulers

- [`Rx.Scheduler.requestAnimationFrame`](schedulers/requestanimationframe.md)
- [`Rx.Scheduler.microtask`](schedulers/microtaskscheduler.md)
