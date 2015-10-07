  var ObservableBase = Rx.ObservableBase,
    CompositeDisposable = Rx.CompositeDisposable,
    dom = Rx.DOM || (Rx.DOM = {}),
    isFunction = Rx.helpers.isFunction,
    inherits = Rx.internals.inherits;
