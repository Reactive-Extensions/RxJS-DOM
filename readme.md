HTML DOM Bindings for the Reactive Extensions for JavaScript
==========================================================
## OVERVIEW

This project provides Reactive Extensions for JavaScript (RxJS) bindings for HTML DOM objects to abstract over the event binding and Ajax requests.  The RxJS libraries are not included with this release and must be installed separately.

## GETTING STARTED

There are a number of ways to get started with the HTML DOM Bindings for RxJS.  

### Download the Source

To download the source of the HTML DOM Bindings for the Reactive Extensions for JavaScript, type in the following:

    git clone https://github.com/Reactive-Extensions/rxjs-dom.git
    cd ./rxjs-dom

### Installing with NPM

	npm install rx-dom

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

The goal here is to take the input from our textbox and throttle it in a way that it doesn't overload the service with requests.  To do that, we'll get the reference to the textInput using the document.getElementById moethod, then bind to the 'keyup' event using the Rx.Observable.fromEvent method which then takes the DOM element event handler and transforms it into an RxJS Observable. 
 
	var textInput = document.getElementById('textInput');
	var throttledInput = Rx.Observable.fromEvent(textInput, 'keyup');

Since we're only interested in the text, we'll use the [select]((http://msdn.microsoft.com/en-us/library/hh244311\(v=VS.103\).aspx)) method to take the event object and return the target's value.  

		.select( function (ev) {
			return textInput.value;
		})

We're also not interested in query terms less than two letters, so we'll trim that user input by using the [where]((http://msdn.microsoft.com/en-us/library/hh229267\(v=VS.103\).aspx)) method returning whether the string length is appropriate.

		.where( function (text) {
			return text.length > 2;
		})

We also want to slow down the user input a little bit so that the external service won't be flooded with requests.  To do that, we'll use the [throttle](http://msdn.microsoft.com/en-us/library/hh229298\(v=VS.103\).aspx)method with a timeout of 500 milliseconds, which will ignore your fast typing and only return a value after you have paused for that time span.  

		.throttle(500)

Lastly, we only want distinct values in our input stream, so we can ignore requests that are not unique, for example if I copy and paste the same value twice, the request will be ignored.

		.distinctUntilChanged();

Putting it all together, our throttledInput looks like the following:

	var textInput = document.getElementById('textInput');
	var throttledInput = Rx.Observable.fromEvent(textInput, 'keyup')
		.select( function (ev) {
			return textInput.value;
		})
		.where( function (text) {
			return text.length > 2;
		})
		.throttle(500)
		.distinctUntilChanged();

Now that we have the throttled input from the textbox, we need to query our service, in this case, the Wikipedia API, for suggestions based upon our input.  To do this, we'll create a function called searchWikipedia which calls the Rx.Observable.getJSONPRequest method which wraps making a JSONP call.

	function searchWikipedia(term) {
		var url = 'http://en.wikipedia.org/w/api.php?action=opensearch'
			+ '&format=json' 
			+ '&search=' + encodeURI(term);
		return Rx.Observable.getJSONPRequest(url);
	}

Now that the Wikipedia Search has been wrapped, we can tie together throttled input and our service call.  In this case, we will call select on the throttledInput to then take the text from our textInput and then use it to query Wikipedia, filtering out empty records.  Finally, to deal with concurrency issues, we'll need to ensure we're getting only the latest value.  Issues can arise with asynchronous programming where an earlier value, if not cancelled properly, can be returned before the latest value is returned, thus causing bugs.  To ensure that this doesn't happen, we have the [switchLatest]((http://msdn.microsoft.com/en-us/library/hh229197(v=VS.103).aspx)) method which returns only the latest value.

	var suggestions = throttledInput.select( function (text) {
 		return searchWikipedia(text);
	})
	.where( function (data) {
		return data.length == 2 && data[1].length > 0;
	})
	.switchLatest();

Finally, we'll subscribe to our observable by calling subscribe which will receive the results and put them into an unordered list.  We'll also handle errors, for example if the server is unavailable by passing in a second function which handles the errors.

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

We've only scratched the surface of this library in this simple example.
		
### Implemented Bindings

Events

- [fromEvent](#fromEvent)

Ajax

- [ajax](#ajax)
- [ajaxCold](#ajaxCold)
- [get](#get)
- [post](#post)

JSONP

- [getJSONPRequest](#getJSONPRequest)
- [getJSONPRequestCold](#getJSONPRequestCold)


## <a id="fromEvent"></a>fromEvent

Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.

### Syntax ###

	Rx.Observable.fromEvent(element, eventName);

### Parameters ###

* element

  > _Required_ **Object** - The DOMElement or NodeList to attach a listener.

* eventName

  > _Required_ **String** - The event name to attach the observable sequence.

### Return Value ###

An observable sequence of events from the specified element and the specified event.  

### Example ###

The following example demonstrates attaching to a text input and listening to the keyup event.

	// Get the element
	var el = document.getElementById('text1');

	// Attach to the keyup event
	var obs = Rx.Observable.fromEvent(el, 'keyup')
		.subscribe( function (e) {
			// Write the keycode
			console.log(e.keyCode);
		});

## <a id="ajax"></a>ajax

Creates a hot observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.

### Syntax ###

	// Using string URL
	Rx.Observable.ajax(url);

	// Using settings object
	Rx.Observable.ajax(settings);

### Parameters ###

The parameters can be one of the following:

* url

  > **String** - A string of the URL to make the Ajax call.

* settings

  > **Object** - An object with the following properties
  	
		- url: URL of the request
  		- Method of the request, such as GET, POST, PUT, PATCH, DELETE
  		- async: Whether the request is async
  		- headers: Optional headers

### Return Value ###

An observable sequence containing the XMLHttpRequest.

### Example ###

The following example uses a simple URL to retrieve a list of products. 

	Rx.Observable.ajax('/products')
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

## <a id="ajaxCold"></a>ajaxCold

Creates a cold observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.

### Syntax ###

	// Using string URL
	Rx.Observable.ajax(url);

	// Using settings object
	Rx.Observable.ajax(settings);

### Parameters ###

The parameters can be one of the following:

* url

  > **String** - A string of the URL to make the Ajax call.

* settings

  > **Object** - An object with the following properties
  	
		- url: URL of the request
  		- Method of the request, such as GET, POST, PUT, PATCH, DELETE
  		- async: Whether the request is async
  		- headers: Optional headers

### Return Value ###

An observable sequence containing the XMLHttpRequest.

### Example ###

The following example uses a simple URL to retrieve a list of products. 

	Rx.Observable.ajax('/products')
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

## <a id="get"></a>get

Creates an observable sequence from an Ajax GET Request with the body.  This method is just shorthand for the ajax method with the GET method.

### Syntax ###

	Rx.Observable.get(url);

### Parameters ###

* url

  > _Required_ **String** - The URL to GET

### Return Value ###

The observable sequence which contains the response from the Ajax GET.

### Example ###

	Rx.Observable.get('/products')
		.subscribe(
			function (xhr) {
				var text = xhr.responseText;
				console.log(text);
			},
			function (err) {
				// Log the error
			}
		);

## <a id="post"></a>post

Creates an observable sequence from an Ajax POST Request with the body.  This method is just shorthand for the ajax method with the POST method.

### Syntax ###

	Rx.Observable.post(url, body);

### Parameters ###

* url

  > _Required_ **String** - The URL to POST to

* sources

  > _Optional_ **Object** - The body to POST

### Return Value ###

The observable sequence which contains the response from the Ajax POST.

### Example ###

	Rx.Observable.post('/test')
		.subscribe(
			function (xhr) {
				console.log(xhr.responseText);
			},
			function (err) {
				// Log the error
			}
		);

## <a id="getJSONPRequest"></a>getJSONPRequest

Creates a hot observable JSONP Request with the specified settings or a string URL.  **Note when using the method with a URL, it must contain JSONPRequest=?.**

### Syntax ###

This method has two versions, one with a string URL, the other with a settings object.

	// With a string URL
	Rx.Observable.getJSONPRequest(url);

	// With a settings object
	Rx.Observable.getJSONPRequest(settings);
	
### Parameters ###

The parameters can be one of the following:

* url

  > **String** - A string of the URL to make the Ajax call.

* settings

  > **Object** - An object with the following properties
  	
		- url: URL of the request
  		- Method of the request, such as GET, POST, PUT, PATCH, DELETE
  		- jsonp: The named callback parameter for the JSONP call

### Return Value ###

A hot observable containing the results from the JSONP call.

### Example ###

The following example uses a simple URL to retrieve a list of entries from Wikipedia. 

	var url = 'http://en.wikipedia.org/w/api.php?action=opensearch'
		+ '&format=json' 
		+ '&search=reactive';

	Rx.Observable.getJSONPRequest(url)
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

## <a id="getJSONPRequestCold"></a>getJSONPRequestCold

Creates a cold observable JSONP Request with the specified settings or a string URL.  **Note when using the method with a URL, it must contain JSONPRequest=?.**

### Syntax ###

This method has two versions, one with a string URL, the other with a settings object.

	// With a string URL
	Rx.Observable.getJSONPRequest(url);

	// With a settings object
	Rx.Observable.getJSONPRequest(settings);
	
### Parameters ###

The parameters can be one of the following:

* url

  > **String** - A string of the URL to make the Ajax call.

* settings

  > **Object** - An object with the following properties
  	
		- url: URL of the request
  		- Method of the request, such as GET, POST, PUT, PATCH, DELETE
  		- jsonp: The named callback parameter for the JSONP call

### Return Value ###

A cold observable containing the results from the JSONP call.

### Example ###

The following example uses a simple URL to retrieve a list of entries from Wikipedia. 

	var url = 'http://en.wikipedia.org/w/api.php?action=opensearch'
		+ '&format=json' 
		+ '&search=reactive';

	Rx.Observable.getJSONPRequestCold(url)
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