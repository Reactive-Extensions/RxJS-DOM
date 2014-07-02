// Check for mutation observer
var BrowserMutationObserver = root.MutationObserver || root.WebKitMutationObserver;
if (BrowserMutationObserver) {

  /**
   * Scheduler that uses a MutationObserver changes as the scheduling mechanism
   */
  Scheduler.mutationObserver = (function () {

    var queue = [], queueId = 0;

    var observer = new BrowserMutationObserver(function() {
      var toProcess = queue.slice(0);
      queue = [];

      toProcess.forEach(function (func) {
        func();
      });
    });

    var element = document.createElement('div');
    observer.observe(element, { attributes: true });

    // Prevent leaks
    root.addEventListener('unload', function () {
      observer.disconnect();
      observer = null;
    }, false);

    function scheduleMethod (action) {
      var id = queueId++;
      queue[id] = action;
      element.setAttribute('drainQueue', 'drainQueue');
      return id;
    }

    function clearMethod (id) {
      delete queue[id];
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
      var scheduler = this,
        dt = Scheduler.normalize(dueTime);

      if (dt === 0) {
        return scheduler.scheduleWithState(state, action);
      }

      var disposable = new SingleAssignmentDisposable(),
        id;
      var scheduleFunc = function () {
        if (id) { clearMethod(id); }
        if (dt - scheduler.now() <= 0) {
          !disposable.isDisposed && (disposable.setDisposable(action(scheduler, state)));
        } else {
          id = scheduleMethod(scheduleFunc);
        }
      };

      id = scheduleMethod(scheduleFunc);

      return new CompositeDisposable(disposable, disposableCreate(function () {
        clearMethod(id);
      }));
    }

    function scheduleAbsolute(state, dueTime, action) {
      return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
    }

    return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);  
  }());
}

