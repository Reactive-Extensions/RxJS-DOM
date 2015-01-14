var originalFileReader;

/** Fake DOM Element */
function FakeEventEmitter() {
    this.listeners = {};
    this.addListenerCalled = false;
    this.removeListenerCalled = false;
}

FakeEventEmitter.prototype.addEventListener = function (eventName, handler, useCapture) {
    this.listeners[eventName] = handler;
    this.addListenerCalled = true;
};

FakeEventEmitter.prototype.removeEventListener = function (eventName, handler, useCapture) {
    delete this.listeners[eventName];
    this.removeListenerCalled = true;
};

FakeEventEmitter.prototype.emit = function (eventName, eventData) {
    if (eventName in this.listeners) {
        this.listeners[eventName](eventData);
    }
};

function MockReader() {
    this.eventemitter = new FakeEventEmitter();
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

module('FileReader', {
    beforeEach : function() {
        originalFileReader = window.FileReader;
    },
    afterEach : function() {
        window.FileReader = originalFileReader;
    }
});

test('File reader success', function(){

    var onNext = Rx.ReactiveTest.onNext,
        onCompleted = Rx.ReactiveTest.onCompleted,
        scheduler = new Rx.TestScheduler();

    window.FileReader = MockReader;

    var observer = scheduler.startWithCreate(function(){
        return Rx.DOM.fromReader("file").asText();
    });

    deepEqual(observer.messages, [onNext(200, "test"), onCompleted(200)]);

});

test('File reader error', function(){
    var onError = Rx.ReactiveTest.onError,
        scheduler = new Rx.TestScheduler();

    window.FileReader = MockReader;

    var tempReadAsText = MockReader.prototype.readAsText;

    MockReader.prototype.readAsText = function() {
        this.eventemitter.emit('error', {target : {error : new Error()}});
    };

    var observer = scheduler.startWithCreate(function(){
        return Rx.DOM.fromReader("file").asText();
    });

    MockReader.prototype.readAsText = tempReadAsText;

    deepEqual(observer.messages, [onError(200, new Error())]);
});

test('File reader progress', function(){
    var onNext = Rx.ReactiveTest.onNext,
        onCompleted = Rx.ReactiveTest.onCompleted,
        scheduler = new Rx.TestScheduler();


    window.FileReader = MockReader;

    var progressObserver = scheduler.createObserver();

    var observer = scheduler.startWithCreate(function(){
        return Rx.DOM.fromReader("file", progressObserver).asArrayBuffer();
    });

    deepEqual(progressObserver.messages, [onNext(200, {value : 20}), onNext(200, {value : 60}), onCompleted(200)]);
    deepEqual(observer.messages, [onNext(200, new ArrayBuffer(10)), onCompleted(200)]);

});



