RxJS-DOM <sup>2.0</sup> - HTML DOM Bindings for the Reactive Extensions for JavaScript 
==========================================================
## OVERVIEW

This project provides Reactive Extensions for JavaScript (RxJS) bindings for HTML DOM objects to abstract over the event binding and Ajax requests.  The RxJS libraries are not included with this release and must be installed separately.

## GETTING STARTED

There are a number of ways to get started with the HTML DOM Bindings for RxJS.  The files are available on [cdnjs](http://cdnjs.com/) and [jsDelivr](http://www.jsdelivr.com/#!rxjs-dom).

### Download the Source

To download the source of the HTML DOM Bindings for the Reactive Extensions for JavaScript, type in the following:

    git clone https://github.com/Reactive-Extensions/rxjs-dom.git
    cd ./rxjs-dom

### Installing with [NPM](https://npmjs.org/)

	npm install rx-dom

### Installing with [Bower](http://bower.io/)

	bower install rxjs-dom

### Installing with [Jam](http://jamjs.org/)
	
	jam install rx-dom

### Installing with [NuGet](http://nuget.org)

	PM> Install-Package RxJS-Bridges-HTML	

### Getting Started with the HTML DOM Bindings

Let's walk through a simple yet powerful example of the Reactive Extensions for JavaScript Bindings for HTML, autocomplete.  In this example, we will take user input from a textbox and trim and throttle the input so that we're not overloading the server with requests for suggestions.

We'll start out with a basic skeleton for our application with script references to RxJS, RxJS Time-based methods, and the RxJS Bindings for HTML DOM, along with a textbox for input and a list for our results.

	<script type="text/javascript" src="rx.js"></script>
	<script type="text/javascript" src="rx.binding.js"></script>
	<script type="text/javascript" src="rx.time.js"></script>
	<script type="text/javascript" src="rx.dom.js"><script>
	<script type="text/javascript">
		
	</script>
	...
	<input id="textInput" type="text"></input>
	<ul id="results"></ul>
	...

The goal here is to take the input from our textbox and throttle it in a way that it doesn't overload the service with requests.  To do that, we'll get the reference to the textInput using the document.getElementById moethod, then bind to the 'keyup' event using the `Rx.DOM.fromEvent` method which then takes the DOM element event handler and transforms it into an RxJS Observable. 
```js
var textInput = document.getElementById('textInput');
var throttledInput = Rx.DOM.fromEvent(textInput, 'keyup');
```
Since we're only interested in the text, we'll use the `select` or `map` method to take the event object and return the target's value.  
```js
	.map( function (ev) {
		return ev.target.value;
	})
```
We're also not interested in query terms less than two letters, so we'll trim that user input by using the `where` or `filter` method returning whether the string length is appropriate.
```js
	.filter( function (text) {
		return text.length > 2;
	})
```
We also want to slow down the user input a little bit so that the external service won't be flooded with requests.  To do that, we'll use the `throttle` method with a timeout of 500 milliseconds, which will ignore your fast typing and only return a value after you have paused for that time span.  
```js
	.throttle(500)
```
Lastly, we only want distinct values in our input stream, so we can ignore requests that are not unique, for example if I copy and paste the same value twice, the request will be ignored using the `distinctUntilChanged` method.
```js
	.distinctUntilChanged();
```
Putting it all together, our throttledInput looks like the following:

```js
var textInput = document.getElementById('textInput');
var throttledInput = Rx.DOM.fromEvent(textInput, 'keyup')
	.map( function (ev) {
		return textInput.value;
	})
	.filter( function (text) {
		return text.length > 2;
	})
	.throttle(500)
	.distinctUntilChanged();
```

Now that we have the throttled input from the textbox, we need to query our service, in this case, the Wikipedia API, for suggestions based upon our input.  To do this, we'll create a function called searchWikipedia which calls the `Rx.DOM.Request.jsonpRequest` method which wraps making a JSONP call.

```js
function searchWikipedia(term) {
	var url = 'http://en.wikipedia.org/w/api.php?action=opensearch'
		+ '&format=json' 
		+ '&search=' + encodeURI(term);
	return Rx.DOM.Ajax.jsonpRequest(url);
}
```

Now that the Wikipedia Search has been wrapped, we can tie together throttled input and our service call.  In this case, we will call select on the throttledInput to then take the text from our textInput and then use it to query Wikipedia, filtering out empty records.  Finally, to deal with concurrency issues, we'll need to ensure we're getting only the latest value.  Issues can arise with asynchronous programming where an earlier value, if not cancelled properly, can be returned before the latest value is returned, thus causing bugs.  To ensure that this doesn't happen, we have the `flatMapLatest` method which returns only the latest value.

```js
var suggestions = throttledInput.flatMapLatest( function (text) {
		return searchWikipedia(text);
});
```

Finally, we'll subscribe to our observable by calling subscribe which will receive the results and put them into an unordered list.  We'll also handle errors, for example if the server is unavailable by passing in a second function which handles the errors.

```js
var resultList = document.getElementById('results');

function clearSelector (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createLineItem(text) {
	var li = document.createElement('li');
	li.innerHTML = text;
	return li;
}

suggestions.subscribe( function (data) {
    var results = data[1];

    clearSelector(resultList);

    for (var i = 0; i < results.length; i++) {
        resultList.appendChild(createLineItem(results[i]));
    }
}, function (e) {
	clearSelector(resultList);
    resultList.appendChild(createLineItem('Error: ' + e));
});

```

We've only scratched the surface of this library in this simple example.
		
### Implemented Bindings

Events

- [`Rx.DOM.fromEvent`](#rxdomfromeventelement-eventname)

Ajax

- [`Rx.DOM.Request.ajax`](#rxdomrequestajaxurl--settings)
- [`Rx.DOM.Request.ajaxCold`](#rxdomrequestajaxcoldurl--settings)
- [`Rx.DOM.Request.get`](#rxdomrequestgeturl)
- [`Rx.DOM.Request.getJSON`](#rxdomrequestgetjsonurl)
- [`Rx.DOM.Request.post`](#rxdomrequestposturl-body)

JSONP

- [`Rx.DOM.Request.jsonpRequest`](#rxdomrequestjsonprequesturl--settings)
- [`Rx.DOM.Request.jsonpRequestCold`](#rxdomrequestjsonprequestcoldurl--settings)

Web Sockets

- [`Rx.DOM.fromWebSocket`](#rxdomfromwebsocketurl-protocol-observeroronnext)

Web Workers

- [`Rx.DOM.fromWebWorker`](#rxdomfromwebworkerurl)

Mutation Observers

- [`Rx.DOM.fromMutationObserver`](#rxdomfrommutationobservertarget-options)

Geolocation

- [`Rx.DOM.Geolocation.getCurrentPosition`](#rxdomgeolocationgetcurrentpositiongeolocationoptions)
- [`Rx.DOM.Geolocation.watchPosition`](#rxdomgeolocationwatchpositiongeolocationoptions)

Schedulers

- [`Rx.Schedulers.requestAnimationFrame`](#rxschedulerrequestanimationframescheduler)
- [`Rx.Schedulers.mutationObserver`](#rxschedulermutationobserverscheduler)

* * *

### <a id="rxdomfromeventelement-eventname"></a>`Rx.DOM.fromEvent(element, eventName)`
<a href="#rxdomfromeventelement-eventname">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L106-L110 "View in source") [&#x24C9;][1]

Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.

#### Arguments
1. `element` *(Node|NodeList)*: The DOMElement or NodeList to attach a listener.
2. `eventName` *(String)*: The event name to attach the observable sequence.

#### Returns
*(Observable)*: An observable sequence of events from the specified element and the specified event.  

#### Example

The following example demonstrates attaching to a text input and listening to the keyup event.
```js
// Get the element
var el = document.getElementById('text1');

// Attach to the keyup event
var obs = Rx.DOM.fromEvent(el, 'keyup')
	.subscribe( function (e) {
		// Write the keycode
		console.log(e.keyCode);
	});
```

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

## LICENSE

Copyright 2013 Microsoft Open Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.