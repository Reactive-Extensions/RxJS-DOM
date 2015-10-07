(function () {
  'use strict'

  var slice = Array.prototype.slice;

  function createMessage(actual, expected) {
    return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
  }

  Array.prototype.assertEqual = function () {
    var expected = slice.call(arguments);
    var actual = this;

    var i, isOk = true;
    if (expected.length !== actual.length) {
      ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
      return;
    }
    for (i = 0; i < expected.length; i++) {
      var e = expected[i], a = actual[i];
      // ALlow for predicates
      if (e.value && typeof e.value.predicate === 'function') {

        isOk = e.time === a.time && e.value.predicate(a.value);
      } else {
        isOk = Rx.internals.isEqual(e, a);
      }

      if (!isOk) {
        break;
      }
    }
    ok(isOk, createMessage(actual, expected));
  };
}());
