(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, window */
  var originalFileReader;

  function Emitter() {
    this.listeners = {};
  }

  Emitter.prototype.addEventListener = function (eventName, handler) {
    this.listeners[eventName] || (this.listeners[eventName] = []);
    this.listeners[eventName].push(handler);
  };

  Emitter.prototype.removeEventListener = function (eventName, handler) {
    var idx = -1;
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        if (handler === this.listeners[eventName][i]) {
          idx = i;
          break;
        }
      }

      idx !== -1 && this.listeners[eventName].splice(idx, 1);
    }
  };

  Emitter.prototype.emit = function (eventName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (this.listeners[eventName]) {
      for (var i = 0, len = this.listeners[eventName].length; i < len; i++) {
        this.listeners[eventName][i].apply(null, args);
      }
    }
  };

  function MockReader() {
    this.eventemitter = new Emitter();
  }

  MockReader.prototype.readAsText = function() {
    this.eventemitter.emit('load', {target : {result : 'test'}});
  };

  MockReader.prototype.readAsArrayBuffer = function() {
    this.eventemitter.emit('progress', {value : 20});
    this.eventemitter.emit('progress', {value : 60});

    var buf = new ArrayBuffer(10);
    buf[0] = 255;

    this.eventemitter.emit('load', {target : {result : new ArrayBuffer(10)}});
  };

  MockReader.prototype.addEventListener = function() {
    this.eventemitter.addEventListener.apply(this.eventemitter, arguments);
  };

  MockReader.prototype.removeEventListener = function() {
    this.eventemitter.removeEventListener.apply(this.eventemitter, arguments);
  };

  MockReader.prototype.abort = function(){};

  QUnit.module('FileReader', {
    beforeEach : function() {
      originalFileReader = window.FileReader;
    },
    afterEach : function() {
      window.FileReader = originalFileReader;
    }
  });

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('File reader success', function(){
    var scheduler = new TestScheduler();

    window.FileReader = MockReader;

    var observer = scheduler.startScheduler(function(){
      return Rx.DOM.fromReader('file').asText();
    });

    observer.messages.assertEqual(
      onNext(200, 'test'),
      onCompleted(200)
    );
  });

  test('File reader error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    window.FileReader = MockReader;

    var tempReadAsText = MockReader.prototype.readAsText;

    MockReader.prototype.readAsText = function() {
      this.eventemitter.emit('error', { target: { error: error } });
    };

    var observer = scheduler.startScheduler(function(){
      return Rx.DOM.fromReader('file').asText();
    });

    MockReader.prototype.readAsText = tempReadAsText;

    observer.messages.assertEqual(
      onError(200, error)
    );
  });

  test('File reader progress', function(){
    var scheduler = new TestScheduler();

    window.FileReader = MockReader;

    var progressObserver = scheduler.createObserver();

    var observer = scheduler.startScheduler(function(){
      return Rx.DOM.fromReader('file', progressObserver).asArrayBuffer();
    });

    progressObserver.messages.assertEqual(
      onNext(200, {value : 20}),
      onNext(200, {value : 60}),
      onCompleted(200)
    );

    observer.messages.assertEqual(
      onNext(200, function (n) { return n.value instanceof ArrayBuffer; }),
      onCompleted(200)
    );
  });

}());
