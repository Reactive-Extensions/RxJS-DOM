    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }    

    var Rx = window.Rx,
        Observable = Rx.Observable,
        observableProto = Observable.prototype,
        observableCreateWithDisposable = Observable.createWithDisposable,
        disposableCreate = Rx.Disposable.create,
        CompositeDisposable = Rx.CompositeDisposable;
