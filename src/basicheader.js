    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }    

    var Rx = window.Rx,
        Observable = Rx.Observable,
        observableProto = Observable.prototype,
        observableCreate = Observable.create,
        observableCreateWithDisposable = Observable.createWithDisposable,
        disposableCreate = Rx.Disposable.create,
        CompositeDisposable = Rx.CompositeDisposable,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        AsynsSubject = Rx.AsynsSubject,
        Subject = Rx.Subject,
        Scheduler = Rx.Scheduler,
        defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }()),
        dom = Rx.DOM = {},
        ajax = Rx.DOM.Request = {},
        hasOwnProperty = {}.hasOwnProperty;
