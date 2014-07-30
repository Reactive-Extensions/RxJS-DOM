var xhr, requests;

module('Ajax Tests', {
	setup: function () {
		xhr = sinon.useFakeXMLHttpRequest();
		requests = [];

		xhr.onCreate = function (xhr) {
			requests.push(xhr);
		};
	}, 
	teardown: function () {
		xhr.restore();
	}
});

test('ajaxCold success no settings', function () {
	var source = Rx.DOM.Request.ajaxCold('/products');

	source.subscribe(
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(200, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			var resp = JSON.parse(x.responseText);
			equal(123, resp[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('ajaxCold failure no settings', function () {
	var source = Rx.DOM.Request.ajaxCold('/products');

	source.subscribe(
		function () {
			// Should not happen
			ok(false);
		},
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			equal('error', x.responseText);
		},
		function () {
			ok(false);
		}
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('ajaxCold success settings', function () {
	var source = Rx.DOM.Request.ajaxCold({
		url: '/products',
		method: 'POST',
		headers: {
			'X-Requested-With': 'RxJS',
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: { id: 123 }
	});

	source.subscribe(
		function (x) {
			// Ensure POST
			equal('POST', x.method);

			// Ensure body data
			ok(123, x.requestBody.id)

			// Ensure headers
			equal('RxJS', x.requestHeaders['X-Requested-With']);
			equal('application/json;charset=utf-8', x.requestHeaders['Content-Type']);

			// Ensure status
			equal(200, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			var resp = JSON.parse(x.responseText);
			equal(123, resp[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}		
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('ajaxCold failure settings', function () {
	var source = Rx.DOM.Request.ajaxCold({
		url: '/products',
		method: 'POST',
		headers: {
			'X-Requested-With': 'RxJS',
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: { id: 123 }
	});

	source.subscribe(
		function () {
			ok(false);
		},
		function (x) { 
			// Ensure POST
			equal('POST', x.method);

			// Ensure headers
			equal('RxJS', x.requestHeaders['X-Requested-With']);
			equal('application/json;charset=utf-8', x.requestHeaders['Content-Type']);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			ok('error', x.responseText);
		},
		function () {
			ok(false);
		}		
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('ajax success no settings', function () {
	var source = Rx.DOM.Request.ajax('/products');

	source.subscribe(
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(200, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			var resp = JSON.parse(x.responseText);
			equal(123, resp[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}		
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('ajax failure no settings', function () {
	var source = Rx.DOM.Request.ajax('/products');

	source.subscribe(
		function () {
			// Should not happen
			ok(false);
		},
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			equal('error', x.responseText);
		},
		function () {
			ok(false);
		}	
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('ajax failure settings', function () {
	var source = Rx.DOM.Request.ajax({
		url: '/products',
		method: 'POST',
		headers: {
			'X-Requested-With': 'RxJS',
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: { id: 123 }
	});

	source.subscribe(
		function () {
			ok(false);
		},
		function (x) { 
			// Ensure POST
			equal('POST', x.method);

			// Ensure headers
			equal('RxJS', x.requestHeaders['X-Requested-With']);
			equal('application/json;charset=utf-8', x.requestHeaders['Content-Type']);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			ok('error', x.responseText);
		},
		function () {
			ok(false);
		}		
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('getCold success', function () {
	var source = Rx.DOM.Request.getCold('/products');

	source.subscribe(
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(200, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			var resp = JSON.parse(x.responseText);
			equal(123, resp[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('getCold failure', function () {
	var source = Rx.DOM.Request.getCold('/products');

	source.subscribe(
		function () {
			// Should not happen
			ok(false);
		},
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			equal('error', x.responseText);
		},
		function () {
			ok(false);
		}
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('get success', function () {
	var source = Rx.DOM.Request.get('/products');

	source.subscribe(
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(200, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			var resp = JSON.parse(x.responseText);
			equal(123, resp[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('get failure', function () {
	var source = Rx.DOM.Request.get('/products');

	source.subscribe(
		function () {
			// Should not happen
			ok(false);
		},
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			equal('error', x.responseText);
		},
		function () {
			ok(false);
		}
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('postCold success', function () {
	var source = Rx.DOM.Request.postCold('/products', { id: 123 });

	source.subscribe(
		function (x) {
			// Ensure GET by default
			equal('POST', x.method);

			// Ensure body
			equal(123, x.requestBody.id);

			// Ensure status
			equal(200, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			var resp = JSON.parse(x.responseText);
			equal(123, resp[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('postCold failure', function () {
	var source = Rx.DOM.Request.postCold('/products', { id: 123 });

	source.subscribe(
		function () {
			// Should not happen
			ok(false);
		},
		function (x) {
			// Ensure GET by default
			equal('POST', x.method);

			// Ensure body
			equal(123, x.requestBody.id);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			equal('error', x.responseText);
		},
		function () {
			ok(false);
		}
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('post success', function () {
	var source = Rx.DOM.Request.post('/products', { id: 123 });

	source.subscribe(
		function (x) {
			// Ensure GET by default
			equal('POST', x.method);

			// Ensure body
			equal(123, x.requestBody.id);

			// Ensure status
			equal(200, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			var resp = JSON.parse(x.responseText);
			equal(123, resp[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('post failure', function () {
	var source = Rx.DOM.Request.post('/products', { id: 123 });

	source.subscribe(
		function () {
			// Should not happen
			ok(false);
		},
		function (x) {
			// Ensure GET by default
			equal('POST', x.method);

			// Ensure body
			equal(123, x.requestBody.id);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			equal('error', x.responseText);
		},
		function () {
			ok(false);
		}
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('getJSONCold success', function () {
	var source = Rx.DOM.Request.getJSONCold('/products');

	source.subscribe(
		function (x) {
			equal(123, x[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('getJSONCold failure', function () {
	var source = Rx.DOM.Request.getJSONCold('/products');

	source.subscribe(
		function () {
			// Should not happen
			ok(false);
		},
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			equal('error', x.responseText);
		},
		function () {
			ok(false);
		}
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

test('getJSON success', function () {
	var source = Rx.DOM.Request.getJSON('/products');

	source.subscribe(
		function (x) {
			equal(123, x[0].id);
		},
		function () { 
			ok(false); 
		},
		function () {
			ok(true);
		}
	);

	requests[0].respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 123 }]');
});

test('getJSON failure', function () {
	var source = Rx.DOM.Request.getJSON('/products');

	source.subscribe(
		function () {
			// Should not happen
			ok(false);
		},
		function (x) {
			// Ensure GET by default
			equal('GET', x.method);

			// Ensure status
			equal(500, x.status);

			// Ensure async
			ok(x.async);

			// Assert equality for the message
			equal('error', x.responseText);
		},
		function () {
			ok(false);
		}
	);

	requests[0].respond(500, { 'Content-Type': 'application/json' }, 'error');
});

asyncTest('jsonpRequest with jsonp callback success', function () {
	window.testCallback = function(observer, data) {
		data[0].correct = true;
		observer.onNext(data);
		observer.onCompleted();
	};
	
	var fakeScript = "data:text/javascript;base64," + btoa(
		'testCallback([{ "id": 123 }])'
	);
	
	var source = Rx.DOM.Request.jsonpRequest({
		url: fakeScript,
		jsonpCallback: 'testCallback'
	});

	source.subscribe(
		function (x) {
			equal(123, x[0].id);
			equal(true, x[0].correct);
		},
		function (e) { 
			ok(false); 
		},
		function () {
			ok(true);
			QUnit.start();
		}
	);
});

asyncTest('jsonpRequest without jsonp callback success', function () {
	var fakeScript = "data:text/javascript;base64," + btoa(
		'testCallback([{ "id": 123 }])'
	);

	var source = Rx.DOM.Request.jsonpRequest({
		url: fakeScript,
		jsonpCallback: 'testCallback'
	});

	source.subscribe(
		function (x) {
			equal(123, x[0].id);
		},
		function (e) { 
			ok(false); 
		},
		function () {
			ok(true);
			QUnit.start();
		}
	);
});