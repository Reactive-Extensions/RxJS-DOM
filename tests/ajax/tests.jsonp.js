(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, asyncTest, Rx, equal, ok */
  QUnit.module('JSONP Tests');

  asyncTest('jsonpRequest with jsonp callback success', function () {

    var fakeScript = "data:text/javascript;base64," + btoa(
      'testCallback([{ "id": 123 }])'
    );

    var source = Rx.DOM.jsonpRequest({
      url: fakeScript,
      jsonpCallback: 'testCallback'
    });

    source.subscribe(
      function (x) {
        equal(123, x.response[0].id);
      },
      function () {
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

    var source = Rx.DOM.jsonpRequest({
      url: fakeScript,
      jsonpCallback: 'testCallback'
    });

    source.subscribe(
      function (x) {
        equal(123, x.response[0].id);
      },
      function () {
        ok(false);
      },
      function () {
        ok(true);
        QUnit.start();
      }
    );
  });

  asyncTest('jsonpRequest without jsonp callback success with 2 observers', function () {
    var fakeScript = "data:text/javascript;base64," + btoa(
      'testCallback([{ "id": 123 }])'
    );

    var source = Rx.DOM.jsonpRequest({
      url: fakeScript,
      jsonpCallback: 'testCallback'
    });

    source.subscribe(
      function (x) {
        equal(123, x.response[0].id);
      },
      function () {
        ok(false);
      },
      function () {
        ok(true);
        QUnit.start();
      }
    );

    var source2 = Rx.DOM.jsonpRequest({
      url: fakeScript,
      jsonpCallback: 'testCallback'
    });

    source2.subscribe(
      function (x) {
        equal(123, x.response[0].id);
      },
      function () {
        ok(false);
      },
      function () {
        ok(true);
        QUnit.start();
      }
    );
  });

}());
