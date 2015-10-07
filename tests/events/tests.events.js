(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  QUnit.module('FromEvent');

  var Observable = Rx.Observable,
      slice = Array.prototype.slice;

  /** Fake DOM Element */
  function FakeDOMStandardElement(nodeName) {
    this.listeners = {};
    this.nodeName = nodeName;
    this.addEventListenerCalled = false;
    this.removeEventListenerCalled = false;
  }

  FakeDOMStandardElement.prototype.addEventListener = function (eventName, handler, useCapture) {
    this.listeners[eventName] || (this.listeners[eventName] = []);
    this.listeners[eventName].push({ handler: handler, useCapture: useCapture });
  };

  FakeDOMStandardElement.prototype.removeEventListener = function (eventName, handler, useCapture) {
    var idx = -1;
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        var e = this.listeners[eventName][i];
        if (e.handler === handler && e.useCapture === useCapture) {
          idx = i;
          break;
        }
      }

      idx !== -1 && this.listeners[eventName].splice(idx, 1);
    }
  };

  FakeDOMStandardElement.prototype.trigger = function (eventName) {
    var args = slice.call(arguments, 1);
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        this.listeners[eventName][i].handler.apply(null, args);
      }
    }
  };

  test('Event 1', function () {
    var element = new FakeDOMStandardElement('foo');

    var d = Observable.fromEvent(element, 'someEvent')
      .subscribe(function (x) { equal(x, 42); });

    element.trigger('someEvent', 42);
    equal(element.listeners['someEvent'].length, 1);

    d.dispose();

    equal(element.listeners['someEvent'].length, 0);
  });

  test('Event 2', function () {
    var element = new FakeDOMStandardElement('foo');

    var d = Observable.fromEvent(
      element,
      'someEvent',
      function (baz, quux) {
        return { foo: baz, bar: quux };
      }
    )
    .subscribe(function (x) {
      equal(x.foo, 'baz');
      equal(x.bar, 'quux');
    });

    element.trigger('someEvent', 'baz', 'quux');
    equal(element.listeners['someEvent'].length, 1);

    d.dispose();

    equal(element.listeners['someEvent'].length, 0);
  });

}());
