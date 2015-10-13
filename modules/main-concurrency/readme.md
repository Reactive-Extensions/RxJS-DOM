# RxJS DOM Concurrency Module #

This project provides Reactive Extensions for JavaScript (RxJS) bindings for HTML DOM objects to abstract over the DOM scheduling using `requestAnimationFrame` and `MutationObserver` using RxJS.

## Details ##

Files:
- [`rx.dom.concurrency.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/modules/main-concurrency/rx.dom.concurrency.js)

NPM Packages:
- [`rx-dom-concurrency`](https://www.npmjs.com/package/rx-dom-concurrency)

## API ##

### Schedulers

- [`Rx.Scheduler.requestAnimationFrame`](schedulers/requestanimationframe.md)
- [`Rx.Scheduler.microtask`](schedulers/microtaskscheduler.md)
