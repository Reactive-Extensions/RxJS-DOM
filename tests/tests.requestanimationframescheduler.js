(function () {
  module('RequestAnimationFrameScheduler');

  var RequestAnimationFrameScheduler = Rx.Scheduler.requestAnimationFrame;

  test('RequestAnimationFrameScheduler_Now', function () {
    var res;
    res = RequestAnimationFrameScheduler.now() - new Date().getTime();
    ok(res < 1000);
  });

  asyncTest('RequestAnimationFrameScheduler_ScheduleAction', 1, function () {
    expect(1);
    RequestAnimationFrameScheduler.schedule(function () {
      ok(true);
      start();
    });
  });

  asyncTest('RequestAnimationFrameScheduler_ScheduleActionDue', function () {
    expect(1);
    var startTime = new Date().getTime(), endTime;

    RequestAnimationFrameScheduler.scheduleWithRelative(200, function () {
      endTime = new Date().getTime();
      ok(endTime - startTime > 180, endTime - startTime);
      start();
    });
  });

  asyncTest('RequestAnimationFrameScheduler_ScheduleActionCancel', 1, function () {
    var set = false;
    var d = RequestAnimationFrameScheduler.scheduleWithRelative(200, function () {
      set = true;
    });

    d.dispose();

    setTimeout(function () {
      ok(!set);
      start();
    }, 400);
  });

}());﻿
