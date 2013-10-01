    // Check for mutation observer
    var BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (BrowserMutationObserver) {

        /**
         * Scheduler that uses a MutationObserver changes as the scheduling mechanism
         * @memberOf {Scheduler}
         */
        Scheduler.mutationObserver = (function () {

            var queue = {}, queueId = 0;

            function cloneObj (obj) {
                var newObj = {};
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        newObj[prop] = obj[prop];
                    }
                }
                return newObj;
            }

            var observer = new BrowserMutationObserver(function() {
                var toProcess = cloneObj(queue);
                queue = {};

                for (var prop in toProcess) {
                    if (toProcess.hasOwnProperty(prop)) {
                        toProcess[prop]();
                    }
                }
            });

            var element = document.createElement('div');
            observer.observe(element, { attributes: true });

            // Prevent leaks
            window.addEventListener('unload', function () {
                observer.disconnect();
                observer = null;
            }, false);

            function scheduleMethod (action) {
                var id = queueId++;
                queue[id] = action;
                element.setAttribute('drainQueue', 'drainQueue');
                return id;
            }

            function cancelMethod (id) {
                delete queue[id];
            }

            function scheduleNow(state, action) {
                var scheduler = this,
                    disposable = new SingleAssignmentDisposable();
                var id = scheduleMethod(function () {
                    if (!disposable.isDisposed) {
                        disposable.setDisposable(action(scheduler, state));
                    }
                });
                return disposable;
            }

            function scheduleRelative(state, dueTime, action) {
                var scheduler = this,
                    dt = Scheduler.normalize(dueTime);
                if (dt === 0) {
                    return scheduler.scheduleWithState(state, action);
                }

                var disposable = new SingleAssignmentDisposable(),
                    id;
                var scheduleFunc = function () {
                    if (id) { cancelMethod(id); }
                    if (dt - scheduler.now() <= 0) {
                        if (!disposable.isDisposed) {
                            disposable.setDisposable(action(scheduler, state));
                        }
                    } else {
                        id = scheduleMethod(scheduleFunc);
                    }
                };

                id = scheduleMethod(scheduleFunc);

                return new CompositeDisposable(disposable, disposableCreate(function () {
                    cancelMethod(id);
                }));
            }

            function scheduleAbsolute(state, dueTime, action) {
                return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
            }

            return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);  
        }());
    }

