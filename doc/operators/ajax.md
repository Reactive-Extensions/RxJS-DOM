`Rx.DOM.ajax(url | settings)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/ajax.js "View in source")

Creates a hot observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.

#### Arguments
- `url` *(String)*: A string of the URL to make the Ajax call.
- `settings` *(Object)*: An object with the following properties

    - `url` *(String)*: URL of the request
      - `method` *(String)*: Method of the request, such as GET, POST, PUT, PATCH, DELETE
      - `crossDomain` *(Boolean)*: true if to use CORS, else false
      - `async` *(Boolean)*: Whether the request is async
      - `headers` *(Object)*: Optional headers
      - `body` *(Object)*: Optional body

#### Returns
*(Observable)*: An observable sequence containing the `XMLHttpRequest`.

#### Example

The following example uses a simple URL to retrieve a list of products.
```js
Rx.DOM.Request.ajax('/products')
  .subscribe(
    function (xhr) {

      var products = JSON.parse(xhr.responseText);

      products.forEach(function (product) {
        console.log(product);
      });
    },
    function (error) {
      // Log the error
    }
  );
```

### Location

File:
- [`/src/ajax.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/src/ajax.js)

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
- [`/tests/tests.ajax.js`](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/tests/tests.ajax.js)
