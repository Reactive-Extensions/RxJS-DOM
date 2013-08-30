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

	npm install rx-jquery

### Installing with [Bower](http://bower.io/)

	bower install rx-jquery

### Installing with [Jam](http://jamjs.org/)
	
	jam install rx-jquery

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
		return textInput.value;
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

Now that the Wikipedia Search has been wrapped, we can tie together throttled input and our service call.  In this case, we will call select on the throttledInput to then take the text from our textInput and then use it to query Wikipedia, filtering out empty records.  Finally, to deal with concurrency issues, we'll need to ensure we're getting only the latest value.  Issues can arise with asynchronous programming where an earlier value, if not cancelled properly, can be returned before the latest value is returned, thus causing bugs.  To ensure that this doesn't happen, we have the `switch` method which returns only the latest value.

```js
var suggestions = throttledInput.map( function (text) {
		return searchWikipedia(text);
})
.filter( function (data) {
	return data.length == 2 && data[1].length > 0;
})
.switch();
```

Finally, we'll subscribe to our observable by calling subscribe which will receive the results and put them into an unordered list.  We'll also handle errors, for example if the server is unavailable by passing in a second function which handles the errors.

```js
var resultList = document.getElementById('results');
var clearSelector = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

suggestions.subscribe( function (data) {
    var results = data[1];

    clearSelector(resultList);

    for (var i = 0; i < results.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = results[i];
        resultList.appendChild(li);
    }
}, function (e) {
	clearSelector(resultList);
    var li = document.createElement('li');
    li.innerHTML = 'Error: ' + e;
    resultList.appendChild(li);
});

```

We've only scratched the surface of this library in this simple example.
		
### Implemented Bindings

Events

- [`Rx.DOM.fromEvent`](#rxdomfromevent)

Ajax

- [`Rx.DOM.Request.ajax`](#rxdomrequestajax)
- [`Rx.DOM.Request.ajaxCold`](#rxdomrequestajaxcold)
- [`Rx.DOM.Request.get`](#rxdomrequestget)
- [`Rx.DOM.Request.getJSON`](#rxdomrequestgetjson)
- [`Rx.DOM.Request.post`](#rxdomrequestpost)

JSONP

- [`Rx.DOM.Request.jsonpRequest`](#rxdomrequestjsonprequest)
- [`Rx.DOM.Request.jsonpRequestCold`](#rxdomrequestjsonprequestcold)

Web Sockets

- [`Rx.DOM.fromWebSocket`](#rxdomfromwebsocket)

Web Workers

- [`Rx.DOM.fromWebWorker`](#rxdomfromwebworker)

Mutation Observers

- [`Rx.DOM.fromMutationObserver`](#rxdomfrommutationobserver)

Schedulers

- [`Rx.Schedulers.requestAnimationFrameScheduler`](#rxschedulerrequestanimationframescheduler)
- [`Rx.Schedulers.mutationObserverScheduler`](#rxschedulermutationobserverscheduler)

* * *

### <a id="rxdomfromevent"></a>`Rx.DOM.fromEvent(element, eventName)`
<a href="#rxdomfromevent">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L106-L110 "View in source") [&#x24C9;][1]

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

### <a id="#rxdomrequestajax"></a>`Rx.DOM.Request.ajax(url | settings)`
<a href="#rxdomrequestajax">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L227-L229 "View in source") [&#x24C9;][1]

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

### <a id="rxdomrequestajaxcold"></a>`Rx.DOM.Request.ajaxCold(url | settings)`
<a href="#rxdomrequestajaxcold">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L145-L204 "View in source") [&#x24C9;][1]

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

### <a id="rxdomrequestget"></a>`Rx.DOM.Request.get(url)`
<a href="#rxdomrequestget">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L248-L250 "View in source") [&#x24C9;][1]

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

### <a id="rxdomrequestgetjson"></a>`Rx.DOM.Request.getJSON(url)`
<a href="#rxdomrequestgetjson">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L259-L264 "View in source") [&#x24C9;][1]

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

### <a id="rxdomrequestpost"></a>`Rx.DOM.Request.post(url, [body])`
<a href="#rxdomrequestpost">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L238-L240 "View in source") [&#x24C9;][1]

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

### <a id="rxdomrequestjsonprequest"></a>`Rx.DOM.Request.jsonpRequest(url | settings)`
<a href="#rxdomrequestjsonprequest">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L366-L368 "View in source") [&#x24C9;][1]

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

### <a id="rxdomrequestjsonprequestcold"></a>`Rx.DOM.Request.jsonpRequestCold(url | settings)`
<a href="#rxdomrequestjsonprequestcold">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L293-L345 "View in source") [&#x24C9;][1]

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

### <a id="rxdomfromwebsocket"></a>`Rx.DOM.fromWebSocket(url, protocol, [observerOrOnNext])`
<a href="#rxdomfromwebsocket">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L382-L420 "View in source") [&#x24C9;][1]

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

### <a id="rxdomfromwebworker"></a>`Rx.DOM.fromWebWorker(url)`
<a href="#rxdomfromwebworker">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L434-L456 "View in source") [&#x24C9;][1]

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

### <a id="rxdomfrommutationobserver"></a>`Rx.DOM.fromMutationObserver(target, options)`
<a href="#rxdomfrommutationobserver">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L471-L485 "View in source") [&#x24C9;][1]

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

### <a id="rxschedulerrequestanimationframescheduler"></a>`Rx.Scheduler.requestAnimationFrameScheduler`
<a href="#rxschedulerrequestanimationframescheduler">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L471-L485 "View in source") [&#x24C9;][1]

Gets a scheduler that schedules schedules work on the `window.requestAnimationFrame` for immediate actions.

#### Example
```js
var obs = Rx.Observable.return(
	42, 
	Rx.Scheduler.requestAnimationFrameScheduler);

obs.subscribe(function (x) {
	// Scheduled using requestAnimationFrame
	console.log(x);
});

// => 42
```
* * *

### <a id="rxschedulermutationobserverscheduler"></a>`Rx.Scheduler.mutationObserverScheduler`
<a href="#rxschedulermutationobserverscheduler">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/rx.dom.js#L516-L566 "View in source") [&#x24C9;][1]

Gets a scheduler that schedules schedules work on the `window.MutationObserver` for immediate actions.

#### Example
```js
var obs = Rx.Observable.return(
	42, 
	Rx.Scheduler.mutationObserverScheduler);

obs.subscribe(function (x) {
	// Scheduled using a MutationObserver
	console.log(x);
});

// => 42
```
* * *

## LICENSE

Copyright 2013 MS Open Tech

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.