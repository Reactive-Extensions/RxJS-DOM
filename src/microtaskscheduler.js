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

    var setImmediate = root.setImmediate;

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

      var element = document.createElement('div');
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
    } else if (typeof setImmediate === 'function') {
      scheduleMethod = setImmediate;
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
        tasksByHandle[currentId] = action;
        root.postMessage(MSG_PREFIX + currentId, '*');
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

    function scheduleNow(state, action) {

      var scheduler = this,
        disposable = new SingleAssignmentDisposable();

      var id = scheduleMethod(function () {
        !disposable.isDisposed && (disposable.setDisposable(action(scheduler, state)));
      });

      return new CompositeDisposable(disposable, disposableCreate(function () {
        clearMethod(id);
      }));
    }

    function scheduleRelative(state, dueTime, action) {
      var scheduler = this, dt = Scheduler.normalize(dueTime);
      if (dt === 0) { return scheduler.scheduleWithState(state, action); }
      var disposable = new SingleAssignmentDisposable();
      var id = root.setTimeout(function () {
        if (!disposable.isDisposed) {
          disposable.setDisposable(action(scheduler, state));
        }
      }, dt);
      return new CompositeDisposable(disposable, disposableCreate(function () {
        root.clearTimeout(id);
      }));
    }

    function scheduleAbsolute(state, dueTime, action) {
      return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
    }

    return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
  }());
