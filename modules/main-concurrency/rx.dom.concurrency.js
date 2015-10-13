// Copyright (c) Microsoft, Inc. All rights reserved. See License.txt in the project root for license information.

;(function (factory) {
  var objectTypes = {
    'function': true,
    'object': true
  };

  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global === 'object' && global);
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

  // Because of build optimizers
  if (typeof define === 'function' && define.amd) {
    define(['rx'], function (Rx, exports) {
      return factory(root, exports, Rx);
    });
  } else if (typeof module === 'object' && module && module.exports === freeExports) {
    module.exports = factory(root, module.exports, require('rx'));
  } else {
    root.Rx = factory(root, {}, root.Rx);
  }
}.call(this, function (root, exp, Rx, undefined) {

  var Disposable = Rx.Disposable,
    BinaryDisposable = Rx.BinaryDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    Scheduler = Rx.Scheduler,
    inherits = Rx.internals.inherits;

  var errorObj = {e: {}};

  function tryCatcherGen(tryCatchTarget) {
    return function tryCatcher() {
      try {
        return tryCatchTarget.apply(this, arguments);
      } catch (e) {
        errorObj.e = e;
        return errorObj;
      }
    };
  }

  function tryCatch(fn) {
    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
    return tryCatcherGen(fn);
  }

  function thrower(e) {
    throw e;
  }

  var requestAnimFrame, cancelAnimFrame;
  if (root.requestAnimationFrame) {
    requestAnimFrame = root.requestAnimationFrame;
    cancelAnimFrame = root.cancelAnimationFrame;
  } else if (root.mozRequestAnimationFrame) {
    requestAnimFrame = root.mozRequestAnimationFrame;
    cancelAnimFrame = root.mozCancelAnimationFrame;
  } else if (root.webkitRequestAnimationFrame) {
    requestAnimFrame = root.webkitRequestAnimationFrame;
    cancelAnimFrame = root.webkitCancelAnimationFrame;
  } else if (root.msRequestAnimationFrame) {
    requestAnimFrame = root.msRequestAnimationFrame;
    cancelAnimFrame = root.msCancelAnimationFrame;
  } else if (root.oRequestAnimationFrame) {
    requestAnimFrame = root.oRequestAnimationFrame;
    cancelAnimFrame = root.oCancelAnimationFrame;
  } else {
    requestAnimFrame = function(cb) { root.setTimeout(cb, 1000 / 60); };
    cancelAnimFrame = root.clearTimeout;
  }

  /**
   * Gets a scheduler that schedules schedules work on the requestAnimationFrame for immediate actions.
   */
  Scheduler.requestAnimationFrame = (function () {
    var RequestAnimationFrameScheduler = (function (__super__) {
      inherits(RequestAnimationFrameScheduler, __super__);
      function RequestAnimationFrameScheduler() {
        __super__.call(this);
      }

      function scheduleAction(disposable, action, scheduler, state) {
        return function schedule() {
          !disposable.isDisposed && disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
        };
      }

      function ClearDisposable(method, id) {
        this._id = id;
        this._method = method;
        this.isDisposed = false;
      }

      ClearDisposable.prototype.dispose = function () {
        if (!this.isDisposed) {
          this.isDisposed = true;
          this._method.call(null, this._id);
        }
      };

      RequestAnimationFrameScheduler.prototype.schedule = function (state, action) {
        var disposable = new SingleAssignmentDisposable(),
            id = requestAnimFrame(scheduleAction(disposable, action, this, state));
        return new BinaryDisposable(disposable, new ClearDisposable(cancelAnimFrame, id));
      };

      RequestAnimationFrameScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
        if (dueTime === 0) { return this.schedule(state, action); }
        var disposable = new SingleAssignmentDisposable(),
            id = root.setTimeout(scheduleAction(disposable, action, this, state), dueTime);
        return new BinaryDisposable(disposable, new ClearDisposable(root.clearTimeout, id));
      };

      return RequestAnimationFrameScheduler;
    }(Scheduler));

    return new RequestAnimationFrameScheduler();
  }());

  /**
   * Scheduler that uses a MutationObserver changes as the scheduling mechanism
   */
  Scheduler.microtask = (function () {

    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false, scheduleMethod;

    function clearMethod(handle) {
      delete tasksByHandle[handle];
    }

    function runTask(handle) {
      if (currentlyRunning) {
        root.setTimeout(function () { runTask(handle) }, 0);
      } else {
        var task = tasksByHandle[handle];
        if (task) {
          currentlyRunning = true;
          try {
            task();
          } catch (e) {
            throw e;
          } finally {
            clearMethod(handle);
            currentlyRunning = false;
          }
        }
      }
    }

    function postMessageSupported () {
      // Ensure not in a worker
      if (!root.postMessage || root.importScripts) { return false; }
      var isAsync = false, oldHandler = root.onmessage;
      // Test for async
      root.onmessage = function () { isAsync = true; };
      root.postMessage('', '*');
      root.onmessage = oldHandler;

      return isAsync;
    }

    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
    var BrowserMutationObserver = root.MutationObserver || root.WebKitMutationObserver;
    if (!!BrowserMutationObserver) {

      var PREFIX = 'drainqueue_';

      var observer = new BrowserMutationObserver(function(mutations) {
        mutations.forEach(function (mutation) {
          runTask(mutation.attributeName.substring(PREFIX.length));
        })
      });

      var element = root.document.createElement('div');
      observer.observe(element, { attributes: true });

      // Prevent leaks
      root.addEventListener('unload', function () {
        observer.disconnect();
        observer = null;
      }, false);

      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        element.setAttribute(PREFIX + id, 'drainQueue');
        return id;
      };
    } else if (typeof root.setImmediate === 'function') {
      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        root.setImmediate(function () { runTask(id); });

        return id;
      };
    } else if (postMessageSupported()) {
      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

      function onGlobalPostMessage(event) {
        // Only if we're a match to avoid any other global events
        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
          runTask(event.data.substring(MSG_PREFIX.length));
        }
      }

      if (root.addEventListener) {
        root.addEventListener('message', onGlobalPostMessage, false);
      } else if (root.attachEvent){
        root.attachEvent('onmessage', onGlobalPostMessage);
      }

      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        root.postMessage(MSG_PREFIX + id, '*');
        return id;
      };
    } else if (!!root.MessageChannel) {
      var channel = new root.MessageChannel();

      channel.port1.onmessage = function (event) {
        runTask(event.data);
      };

      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        channel.port2.postMessage(id);
        return id;
      };
    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {

      scheduleMethod = function (action) {
        var scriptElement = root.document.createElement('script');
        var id = nextHandle++;
        tasksByHandle[id] = action;

        scriptElement.onreadystatechange = function () {
          runTask(id);
          scriptElement.onreadystatechange = null;
          scriptElement.parentNode.removeChild(scriptElement);
          scriptElement = null;
        };
        root.document.documentElement.appendChild(scriptElement);

        return id;
      };

    } else {
      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        root.setTimeout(function () {
          runTask(id);
        }, 0);

        return id;
      };
    }

    var MicroTaskScheduler = (function (__super__) {
      inherits(MicroTaskScheduler, __super__);
      function MicroTaskScheduler() {
        __super__.call(this);
      }

      function scheduleAction(disposable, action, scheduler, state) {
        return function schedule() {
          !disposable.isDisposed && disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
        };
      }

      function ClearDisposable(method, id) {
        this._id = id;
        this._method = method;
        this.isDisposed = false;
      }

      ClearDisposable.prototype.dispose = function () {
        if (!this.isDisposed) {
          this.isDisposed = true;
          this._method.call(null, this._id);
        }
      };

      MicroTaskScheduler.prototype.schedule = function (state, action) {
        var disposable = new SingleAssignmentDisposable(),
            id = scheduleMethod(scheduleAction(disposable, action, this, state));
        return new BinaryDisposable(disposable, new ClearDisposable(clearMethod, id));
      };

      MicroTaskScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
        if (dueTime === 0) { return this.schedule(state, action); }
        var disposable = new SingleAssignmentDisposable(),
            id = root.setTimeout(scheduleAction(disposable, action, this, state), dueTime);
        return new BinaryDisposable(disposable, new ClearDisposable(root.clearTimeout, id));
      };

      return MicroTaskScheduler;
    }(Scheduler));

    return new MicroTaskScheduler();
  }());

  return Rx;
}));