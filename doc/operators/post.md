### `Rx.DOM.post(url, [body])`
### `Rx.DOM.post(settings)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/ajax/ajax.js "View in source")

Creates an observable sequence from an Ajax POST Request with the body.  This is just a shortcut to the [`Rx.DOM.ajax`](ajax.md) method with the POST method.

#### Arguments
- `url` *(String)*: A string of the URL to make the Ajax call.
- `[body]` *(Object)*: The body to post

OR

- `settings` *(Object)*: An object with the following properties:

    - `async` *(Boolean)*: Whether the request is async. The default is `true`.
    - `body` *(Object)*: Optional body
    - `crossDomain` *(Boolean)*: true if to use CORS, else false. The default is `false`.
    - `headers` *(Object)*: Optional headers
    - `password` *(String)*: The password for the request.
    - `progressObserver` *(Observer)*: An optional `Observer` which listen to XHR2 progress events.
    - `responseType` *(String)*: The response type. Either can be 'json' or 'text'. The default is 'text'
    - `url` *(String)*: URL of the request
    - `user` *(String)*: The user for the request.


#### Returns
*(Observable)*: The observable sequence which contains the response from the Ajax POST.

#### Example
```js
Rx.DOM.post('/test', { text: 'sometext' })
  .subscribe(
    function (data) {
      console.log(data.response);
    },
    function (err) {
      // Log the error
    }
  );
```

### Location

File:
- [`/src/ajax/ajax.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/ajax/ajax.js)

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
- [`/tests/ajax/tests.ajax.js](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/tests/ajax/tests.ajax.js)
