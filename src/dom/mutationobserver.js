  function getMutationObserver(next) {
    var M = root.MutationObserver || root.WebKitMutationObserver;
    return new M(next);
  }

  var MutationObserverObservable = (function (__super__) {
    inherits(MutationObserverObservable, __super__);
    function MutationObserverObservable(target, options) {
      this._target = target;
      this._options = options;
      __super__.call(this);
    }

    function InnerDisposable(mutationObserver) {
      this._m = mutationObserver;
      this.isDisposed = false;
    }

    InnerDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._m.disconnect();
      }
    };

    MutationObserverObservable.prototype.subscribeCore = function (o) {
      var mutationObserver = getMutationObserver(function (e) { o.onNext(e); });
      mutationObserver.observe(this._target, this._options);
      return new InnerDisposable(mutationObserver);
    };

    return MutationObserverObservable;
  }(ObservableBase));

  /**
   * Creates an observable sequence from a Mutation Observer.
   * MutationObserver provides developers a way to react to changes in a DOM.
   * @example
   *  Rx.DOM.fromMutationObserver(document.getElementById('foo'), { attributes: true, childList: true, characterData: true });
   *
   * @param {Object} target The Node on which to obserave DOM mutations.
   * @param {Object} options A MutationObserverInit object, specifies which DOM mutations should be reported.
   * @returns {Observable} An observable sequence which contains mutations on the given DOM target.
   */
  dom.fromMutationObserver = function (target, options) {
    if (!(root.MutationObserver || root.WebKitMutationObserver)) { throw new TypeError('MutationObserver not implemented in your runtime.'); }
    return new MutationObserverObservable(target, options);
  };
