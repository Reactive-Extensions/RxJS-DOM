(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, asyncTest, Rx, ok, start */
  QUnit.module('RequestAnimationFrameScheduler');

  test('RequestAnimationFrameScheduler now', function () {
    var res = Rx.Scheduler.requestAnimationFrame.now() - new Date().getTime();
    ok(res < 1000);
  });

  asyncTest('RequestAnimationFrameScheduler schedule', function () {
    Rx.Scheduler.requestAnimationFrame.schedule(null, function () {
      ok(true);
      start();
    });
  });

  asyncTest('RequestAnimationFrameScheduler schedule future relative', function () {
    Rx.Scheduler.requestAnimationFrame.scheduleFuture(new Date().getTime(), 200, function (s, startTime) {
      var endTime = new Date().getTime();
      ok(endTime - startTime > 180, endTime - startTime);
      start();
    });
  });

  asyncTest('RequestAnimationFrameScheduler schedule future absolute', function () {
    Rx.Scheduler.requestAnimationFrame.scheduleFuture(new Date().getTime(), new Date(Date.now() + 200), function (s, startTime) {
      var endTime = new Date().getTime();
      ok(endTime - startTime > 180, endTime - startTime);
      start();
    });
  });

  asyncTest('RequestAnimationFrameScheduler schedule action and cancel', function () {
    var set = false;
    var d = Rx.Scheduler.requestAnimationFrame.scheduleFuture(null, 200, function () {
      set = true;
    });

    d.dispose();

    setTimeout(function () {
      ok(!set);
      start();
    }, 400);
  });
}());
