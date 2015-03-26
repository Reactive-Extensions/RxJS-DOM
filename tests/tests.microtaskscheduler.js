(function () {
  module('MicrotaskScheduler');

  var MicrotaskScheduler = Rx.Scheduler.microtask;

  test('MicrotaskScheduler_Now', function () {
    var res;
    res = MicrotaskScheduler.now() - new Date().getTime();
    ok(res < 1000);
  });

  asyncTest('MicrotaskScheduler_ScheduleAction', 1, function () {
    expect(1);
    MicrotaskScheduler.schedule(function () {
      ok(true);
      start();
    });
  });

  asyncTest('MicrotaskScheduler_ScheduleActionDue', function () {
    expect(1);
    var startTime = new Date().getTime(), endTime;

    MicrotaskScheduler.scheduleWithRelative(200, function () {
      endTime = new Date().getTime();
      ok(endTime - startTime > 180, endTime - startTime);
      start();
    });
  });

  asyncTest('MicrotaskScheduler_ScheduleActionCancel', 1, function () {
    var set = false;
    var d = MicrotaskScheduler.scheduleWithRelative(200, function () {
      set = true;
    });

    d.dispose();

    setTimeout(function () {
      ok(!set);
      start();
    }, 400);
  });

}());﻿
