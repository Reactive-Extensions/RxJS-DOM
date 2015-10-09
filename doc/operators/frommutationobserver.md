### `Rx.DOM.fromMutationObserver(target, options)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/mutationobserver.js "View in source")

Creates an observable sequence from a `MutationObserver`.  The `MutationObserver` provides developers a way to react to changes in a DOM.  This requires `MutationObserver` to be supported in your browser/JavaScript runtime.

#### Arguments
1. `target` *(Node)*: The Node on which to observe DOM mutations.
2. `options` *(MutationObserverInit)*: A [`MutationObserverInit`](http://msdn.microsoft.com/en-us/library/windows/apps/dn252345.aspx) object, specifies which DOM mutations should be reported.

#### Returns
*(Observable)*: An observable sequence which contains mutations on the given DOM target.

#### Example
```js
var foo = document.getElementById('foo');

var obs = Rx.DOM.fromMutationObserver(foo, {
  attributes: true,
  childList: true,
  characterData: true,
  attributeFilter: ["id", "dir"],
  attributeOldValue: true
});

foo.dir = 'rtl';

// Listen for mutations
obs.subscribe(function (mutations) {
    mutations.forEach(function(mutation) {
    console.log("Type of mutation: " + mutation.type);

    if ("attributes" === mutation.type) {
      console.log("Old attribute value: " + mutation.oldValue);
    }
  });
});
```

### Location

File:
- [`/src/dom/mutationobserver.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/mutationobserver.js)

Dist:
- [`rx.dom.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/dist/rx.dom.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) |  [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)

NPM Packages:
- [`rx-dom`](https://preview.npmjs.com/package/rx-dom)

NuGet Packages:
- [`RxJS-Bridges-HTML`](http://www.nuget.org/packages/RxJS-Bridges-HTML/)

Unit Tests:
- [`/tests/dom/tests.mutationobserver.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/tests/dom/tests.mutationobserver.js)
