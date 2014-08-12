module('JSONP Tests');

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