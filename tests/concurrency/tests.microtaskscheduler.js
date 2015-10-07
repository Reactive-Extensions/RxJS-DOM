(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, asyncTest, Rx, ok, start */
  QUnit.module('MicrotaskScheduler');

  test('MicrotaskScheduler now', function () {
    var res = Rx.Scheduler.microtask.now() - new Date().getTime();
    ok(res < 1000);
  });

  asyncTest('MicrotaskScheduler schedule', function () {
    Rx.Scheduler.microtask.schedule(null, function () {
      ok(true);
      start();
    });
  });

  asyncTest('MicrotaskScheduler schedule future relative', function () {
    Rx.Scheduler.microtask.scheduleFuture(new Date().getTime(), 200, function (s, startTime) {
      var endTime = new Date().getTime();
      ok(endTime - startTime > 180, endTime - startTime);
      start();
    });
  });

  asyncTest('MicrotaskScheduler schedule future absolute', function () {
    Rx.Scheduler.microtask.scheduleFuture(new Date().getTime(), new Date(Date.now() + 200), function (s, startTime) {
      var endTime = new Date().getTime();
      ok(endTime - startTime > 180, endTime - startTime);
      start();
    });
  });

  asyncTest('MicrotaskScheduler schedule action and cancel', function () {
    var set = false;
    var d = Rx.Scheduler.microtask.scheduleFuture(null, 200, function () {
      set = true;
    });

    d.dispose();

    setTimeout(function () {
      ok(!set);
      start();
    }, 400);
  });
}());
