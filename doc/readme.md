# RxJS-DOM <sup>v2.0</sup>

Reactive Extensions (Rx) is a library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators.  Data sequences can take many forms, such as a stream of data from a file or web service, web services requests, system notifications, or a series of events such as user input.  Reactive Extensions represents all these data sequences as observable sequences. An application can subscribe to these observable sequences to receive asynchronous notifications as new data arrive. This library provides bridges to common DOM related features such as events, Ajax requests, JSONP requests, and HTML5 features like WebSockets, Web Workers, Geolocation, MutationObservers and more.

## Reactive Extensions Binding for the DOM (RxJS-DOM) API

This section contains the reference documentation for the Reactive Extensions for the DOM class library.

### Events

- [`Rx.DOM.fromEvent`](operators/fromevent.md)
- [`Rx.DOM.ready`](operators/ready.md)

### Event Shortcuts

- [`Rx.DOM.blur`](operators/blur.md)
- [`Rx.DOM.change`](operators/change.md)
- [`Rx.DOM.click`](operators/click.md)
- [`Rx.DOM.contextmenu`](operators/contextmenu.md)
- [`Rx.DOM.dblclick`](operators/dblclick.md)
- [`Rx.DOM.error`](operators/error.md)
- [`Rx.DOM.focus`](operators/focus.md)
- [`Rx.DOM.focusin`](operators/focusin.md)
- [`Rx.DOM.focusout`](operators/focusout.md)
- [`Rx.DOM.keydown`](operators/keydown.md)
- [`Rx.DOM.keypress`](operators/keypress.md)
- [`Rx.DOM.keyup`](operators/keyup.md)
- [`Rx.DOM.load`](operators/load.md)
- [`Rx.DOM.mousedown`](operators/mousedown.md)
- [`Rx.DOM.mouseenter`](operators/mouseenter.md)
- [`Rx.DOM.mouseleave`](operators/mouseleave.md)
- [`Rx.DOM.mousemove`](operators/mousemove.md)
- [`Rx.DOM.mouseout`](operators/mouseout.md)
- [`Rx.DOM.mouseover`](operators/mouseover.md)
- [`Rx.DOM.mouseup`](operators/mouseup.md)
- [`Rx.DOM.resize`](operators/resize.md)
- [`Rx.DOM.scroll`](operators/scroll.md)
- [`Rx.DOM.select`](operators/select.md)
- [`Rx.DOM.submit`](operators/submit.md)
- [`Rx.DOM.unload`](operators/unload.md)

### Pointer Events

- [`Rx.DOM.pointerdown`](operators/pointerdown.md)
- [`Rx.DOM.pointerenter`](operators/pointerenter.md)
- [`Rx.DOM.pointerleave`](operators/pointerleave.md)
- [`Rx.DOM.pointermove`](operators/pointermove.md)
- [`Rx.DOM.pointerout`](operators/pointerout.md)
- [`Rx.DOM.pointerover`](operators/pointerover.md)
- [`Rx.DOM.pointerup`](operators/pointerup.md)

### Touch Events 

- [`Rx.DOM.touchcancel`](operators/touchcancel.md)
- [`Rx.DOM.touchend`](operators/touchend.md)
- [`Rx.DOM.touchmove`](operators/touchmove.md)
- [`Rx.DOM.touchstart`](operators/touchstart.md)

### Ajax

- [`Rx.DOM.ajax`](operators/ajax.md)
- [`Rx.DOM.get`](operators/get.md)
- [`Rx.DOM.getJSON`](operators/getjson.md)
- [`Rx.DOM.post`](operators/post.md)
- [`Rx.DOM.jsonpRequest`](operators/jsonprequest.md)

Web Sockets

- [`Rx.DOM.fromWebSocket`](operators/fromwebsocket.md)

Web Workers

- [`Rx.DOM.fromWebWorker`](operators/fromwebworker.md)

Mutation Observers

- [`Rx.DOM.fromMutationObserver`](operators/frommutationobserver)

Geolocation

- [`Rx.DOM.geolocation.getCurrentPosition`](operators/getcurrentposition.md)
- [`Rx.DOM.geolocation.watchPosition`](operators/watchposition.md)

Schedulers

- [`Rx.Scheduler.requestAnimationFrame`](schedulers/requestanimationframe.md)
- [`Rx.Scheduler.mutationObserver`](schedulers/mutationobserver.md)

* * *

### <a id="#rxdomrequestajaxurl--settings"></a>`Rx.DOM.Request.ajax(url | settings)`
<a href="#rxdomrequestajaxurl--settings">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L227-L229 "View in source") [&#x24C9;][1]

Creates a hot observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.

#### Arguments
1. `url` *(String)*: A string of the URL to make the Ajax call.
1. `settings` *(Object)*: An object with the following properties
  	
		- `url` *(String)*: URL of the request
  		- `method` *(String)*: Method of the request, such as GET, POST, PUT, PATCH, DELETE
  		- `async` *(Boolean)*: Whether the request is async
  		- `headers` *(Object)*: Optional headers

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
* * *

### <a id="rxdomrequestajaxcoldurl--settings"></a>`Rx.DOM.Request.ajaxCold(url | settings)`
<a href="#rxdomrequestajaxcoldurl--settings">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L145-L204 "View in source") [&#x24C9;][1]

Creates a cold observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.

#### Syntax
```js
// Using string URL
Rx.DOM.Request.ajaxCold(url);

// Using settings object
Rx.DOM.Request.ajaxCold(settings);
```
#### Arguments
1. `url` *(String)*: A string of the URL to make the Ajax call.
1. `settings` *(Object)*: An object with the following properties
  	
		- `url` *(String)*: URL of the request
  		- `method` *(String)*: Method of the request, such as GET, POST, PUT, PATCH, DELETE
  		- `async` *(Boolean)*: Whether the request is async
  		- `headers` *(Object)*: Optional headers

#### Returns
*(Observable)*: An observable sequence containing the `XMLHttpRequest`.

#### Example

The following example uses a simple URL to retrieve a list of products. 
```js
Rx.DOM.Request.ajaxCold('/products')
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
* * *

### <a id="rxdomrequestgeturl"></a>`Rx.DOM.Request.get(url)`
<a href="#rxdomrequestgeturl">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L248-L250 "View in source") [&#x24C9;][1]

Creates an observable sequence from an Ajax GET Request with the body.  This method is just shorthand for the `Rx.DOM.Request.ajax` method with the GET method.

#### Arguments
1. `url` *(String)*: A string of the URL to make the Ajax call.

#### Returns
*(Observable)*: The observable sequence which contains the response from the Ajax GET.

#### Example
```js
Rx.DOM.Request.get('/products')
	.subscribe(
		function (xhr) {
			var text = xhr.responseText;
			console.log(text);
		},
		function (err) {
			// Log the error
		}
	);
```
* * *

### <a id="rxdomrequestgetjsonurl"></a>`Rx.DOM.Request.getJSON(url)`
<a href="#rxdomrequestgetjsonurl">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L259-L264 "View in source") [&#x24C9;][1]

Creates an observable sequence from JSON from an Ajax request.

#### Arguments
1. `url` *(String)*: A string of the URL to make the Ajax call.

#### Returns
*(Observable)*: The observable sequence which contains the parsed JSON.

#### Example
```js
Rx.DOM.Request.get('/products')
	.subscribe(
		function (data) {
			// Log data length
			console.log(data.length);
		},
		function (err) {
			// Log the error
		}
	);
```
* * *

### <a id="rxdomrequestposturl-body"></a>`Rx.DOM.Request.post(url, [body])`
<a href="#rxdomrequestposturl-body">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L238-L240 "View in source") [&#x24C9;][1]

Creates an observable sequence from an Ajax POST Request with the body.  This method is just shorthand for the `Rx.DOM.Request.ajax` method with the POST method.

#### Syntax
```js
Rx.DOM.Request.post(url, body);
```
#### Arguments
1. `url` *(String)*: A string of the URL to make the Ajax call.
2. `[body]` *(Object)*: The body to post

#### Returns
*(Observable)*: The observable sequence which contains the response from the Ajax POST.

#### Example
```js
Rx.DOM.Request.post('/test')
	.subscribe(
		function (xhr) {
			console.log(xhr.responseText);
		},
		function (err) {
			// Log the error
		}
	);
```
***

### <a id="rxdomrequestjsonprequesturl--settings"></a>`Rx.DOM.Request.jsonpRequest(url | settings)`
<a href="#rxdomrequestjsonprequesturl--settings">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L366-L368 "View in source") [&#x24C9;][1]

Creates a hot observable JSONP Request with the specified settings or a string URL.  **Note when using the method with a URL, it must contain JSONPRequest=?.**

#### Syntax

This method has two versions, one with a string URL, the other with a settings object.
```js
// With a string URL
Rx.DOM.Request.jsonpRequest(url);

// With a settings object
Rx.DOM.Request.jsonpRequest(settings);
```
#### Arguments
1. `url` *(String)*: A string of the URL to make the JSONP call.
1. `settings` *(Object)*: An object with the following properties:
		- `url` *(String)*: URL of the request
  		- `jsonp` *(String)*: The named callback parameter for the JSONP call
  		- `jsonpCallback` *(String)*: Name of the function in the root object that JSONP will call. This is useful for when the JSONP callback is hardcoded and can't be changed

#### Returns
*(Observable)*: A hot observable containing the results from the JSONP call.

#### Example

The following example uses a simple URL to retrieve a list of entries from Wikipedia. 

```js
var url = 'http://en.wikipedia.org/w/api.php?action=opensearch'
	+ '&format=json' 
	+ '&search=reactive';

Rx.DOM.Request.jsonpRequest(url)
	.subscribe( 
		function (data) {
			data[1].forEach(function (item) {
				console.log(item);
			});
		},
		function (error) {
			// Log the error
		}
	);
```

* * *

### <a id="rxdomrequestjsonprequestcoldurl--settings"></a>`Rx.DOM.Request.jsonpRequestCold(url | settings)`
<a href="#rxdomrequestjsonprequestcoldurl--settings">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L293-L345 "View in source") [&#x24C9;][1]

Creates a cold observable JSONP Request with the specified settings or a string URL.  **Note when using the method with a URL, it must contain JSONPRequest=?.**

#### Syntax

This method has two versions, one with a string URL, the other with a settings object.
```js
// With a string URL
Rx.DOM.Request.jsonpRequestCold(url);

// With a settings object
Rx.DOM.Request.jsonpRequestCold(settings);
```
#### Arguments
1. `url` *(String)*: A string of the URL to make the JSONP call.
1. `settings` *(Object)*: An object with the following properties:
		- `url` *(String)*: URL of the request
  		- `jsonp` *(String)*: The named callback parameter for the JSONP call

#### Returns
*(Observable)*: A cold observable containing the results from the JSONP call.

#### Example

The following example uses a simple URL to retrieve a list of entries from Wikipedia. 
```js
var url = 'http://en.wikipedia.org/w/api.php?action=opensearch'
	+ '&format=json' 
	+ '&search=reactive';

Rx.DOM.Request.jsonpRequestCold(url)
	.subscribe( 
		function (data) {
			data[1].forEach(function (item) {
				console.log(item);
			});
		},
		function (error) {
			// Log the error
		}
	);
```
* * *

### <a id="rxdomfromwebsocketurl-protocol-observeroronnext"></a>`Rx.DOM.fromWebSocket(url, protocol, [observerOrOnNext])`
<a href="#rxdomfromwebsocketurl-protocol-observeroronnext">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L382-L420 "View in source") [&#x24C9;][1]

Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.

#### Arguments
1. `url` *(String)*: The URL of the WebSocket.
2. `protocol` *(String)*: The protocol of the WebSocket.
3. `[observerOrOnNext]` *(Rx.Observer|Function)*: An optional Observer or onNext function to capture the open event.

#### Returns
*(Subject)*: A Subject which wraps a WebSocket.

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
* * *

### <a id="rxdomfromwebworkerurl"></a>`Rx.DOM.fromWebWorker(url)`
<a href="#rxdomfromwebworkerurl">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L434-L456 "View in source") [&#x24C9;][1]

Creates a Web Worker with a given URL as a Subject.

#### Syntax
```js
Rx.DOM.fromWebWorker(url);
```	
#### Arguments
1. `url` *(String)*: The URL of the Web Worker.

#### Returns
*(Subject)*: A Subject which wraps a Web Worker.

#### Example
```js
var worker = Rx.DOM.fromWebWorker('worker.js');

worker.subscribe(function (e) {
	console.log(e.data);
});

worker.onNext('some data');
```
* * *

### <a id="rxdomfrommutationobservertarget-options"></a>`Rx.DOM.fromMutationObserver(target, options)`
<a href="#rxdomfrommutationobservertarget-options">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L471-L485 "View in source") [&#x24C9;][1]

Creates an observable sequence from a `MutationObserver`.  The `MutationObserver` provides developers a way to react to changes in a DOM.  This requires `MutationObserver` to be supported in your browser/JavaScript runtime.

#### Arguments
1. `target` *(Node)*: The Node on which to obserave DOM mutations.
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
	attributeFilter: ["id", "dir"]
});

foo.dir = 'rtl';

// Listen for mutations
obs.subscribe(function (mutations) {
    mutations.forEach(function(mutation) {
		console.log("Type of mutation: " + mutation.type);

		if ("attributes" === mutation.type) {
			console.log("Old attribute value: " + mutationRecord.oldValue);
		}
	});
});
```
* * *

### <a id="rxdomgeolocationgetcurrentpositiongeolocationoptions"></a>`Rx.DOM.Geolocation.getCurrentPosition([geolocationOptions])`
<a href="#rxdomgeolocationgetcurrentpositiongeolocationoptions">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L688-L702 "View in source") [&#x24C9;][1]

Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.

#### Arguments
1. `[geolocationOptions]` *(Object)*: An object literal to specify one or more of the following attributes and desired values:
     - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
     - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
        If timeout is Infinity, (the default value) the location request will not time out.
        If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
     - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
        If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
        If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
        If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.

#### Returns
*(Observable)*: An observable sequence with the current geographical location of the device running the client.

#### Example
```js
var source = Rx.DOM.Geolocation.getCurrentPosition();

var subscription = source.subscribe(
	function (pos) {
		console.log('Next:' + position.coords.latitude + ',' + position.coords.longitude);
	},
	function (err) {
		var message = '';
		switch (err.code) {
			case err.PERMISSION_DENIED:
				message = 'Permission denied';
				break;
			case err.POSITION_UNAVAILABLE:
				message = 'Position unavailable';
				break;
			case err.PERMISSION_DENIED_TIMEOUT:
				message = 'Position timeout';
				break;
		}
		console.log('Error: ' + message);
	},
	function () {
		console.log('Completed');
	});
```
* * *

### <a id="rxdomgeolocationwatchpositiongeolocationoptions"></a>`Rx.DOM.Geolocation.watchPosition([geolocationOptions])`
<a href="#rxdomgeolocationwatchpositiongeolocationoptions">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L717-L733 "View in source") [&#x24C9;][1]

Begins listening for updates to the current geographical location of the device running the client.

#### Arguments
1. `[geolocationOptions]` *(Object)*: An object literal to specify one or more of the following attributes and desired values:
     - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
     - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
        If timeout is Infinity, (the default value) the location request will not time out.
        If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
     - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
        If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
        If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
        If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.

#### Returns
*(Observable)*: An observable sequence with the current geographical location of the device running the client.

#### Example
```js
var source = Rx.DOM.Geolocation.watchPosition();

var subscription = source.subscribe(
	function (pos) {
		console.log('Next:' + position.coords.latitude + ',' + position.coords.longitude);
	},
	function (err) {
		var message = '';
		switch (err.code) {
			case err.PERMISSION_DENIED:
				message = 'Permission denied';
				break;
			case err.POSITION_UNAVAILABLE:
				message = 'Position unavailable';
				break;
			case err.PERMISSION_DENIED_TIMEOUT:
				message = 'Position timeout';
				break;
		}
		console.log('Error: ' + message);
	},
	function () {
		console.log('Completed');
	});
```
* * *


### <a id="rxschedulerrequestanimationframe"></a>`Rx.Scheduler.requestAnimationFrame`
<a href="#rxschedulerrequestanimationframe">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L471-L485 "View in source") [&#x24C9;][1]

Gets a scheduler that schedules schedules work on the `window.requestAnimationFrame` for immediate actions.

#### Example
```js
var obs = Rx.Observable.return(
	42, 
	Rx.Scheduler.requestAnimationFrame);

obs.subscribe(function (x) {
	// Scheduled using requestAnimationFrame
	console.log(x);
});

// => 42
```
* * *

### <a id="rxschedulermutationobserver"></a>`Rx.Scheduler.mutationObserver`
<a href="#rxschedulermutationobserver">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L516-L566 "View in source") [&#x24C9;][1]

Gets a scheduler that schedules schedules work on the `window.MutationObserver` for immediate actions.

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
* * *