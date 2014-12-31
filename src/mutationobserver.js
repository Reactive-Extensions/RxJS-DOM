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
    var BrowserMutationObserver = root.MutationObserver || root.WebKitMutationObserver;
    if (!BrowserMutationObserver) { throw new TypeError('MutationObserver not implemented in your runtime.'); }
    return observableCreate(function (observer) {
      var mutationObserver = new BrowserMutationObserver(observer.onNext.bind(observer));
      mutationObserver.observe(target, options);

      return mutationObserver.disconnect.bind(mutationObserver);
    });
  };
