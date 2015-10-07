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
