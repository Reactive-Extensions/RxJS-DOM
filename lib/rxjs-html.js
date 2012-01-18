/**
* Copyright 2011 Microsoft Corporation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

(function (global) {
	var root = global.Rx,
		Observable = root.Observable,
		observableProto = Observable.prototype,
		observableCreateWithDisposable = Observable.createWithDisposable,
		disposableCreate = root.Disposable.create,
		AsyncSubject = root.AsyncSubject;

	function createListener(element, eventName, handler) {
  		if (element.addEventListener) {
    		element.addEventListener(eventName, handler, false);
    		return disposableCreate(function () {
				element.removeEventListener(eventName, handler, false);
    		});
  		} else if (element.attachEvent) {
  			var wrappedHandler = function (e) {
  				handler.call(element, e || global.event);	
  			};
    		element.attachEvent('on' + eventName, wrappedHandler);
    		return disposableCreate(function () {
				element.detachEvent('on' + eventName, wrappedHandler);
    		});    		
  		} else {
    		element['on' + eventName] = handler;
    		return disposableCreate(function () {
				element['on' + eventName] = null;
    		});
  		}
	}

	Observable.fromEvent = function (element, eventName) {
		return observableCreateWithDisposable(function (observer) {
			var handler = function (e) {
				observer.onNext(e);	
			};
			var listener = createListener(element, eventName, handler);
			return listener;
		});
	};

	var uniqueId = 0;
	Observable.getScript = function (settings) {
		settings || (settings = {});
		var subject = new AsyncSubject(),
			tag = document.createElement('script'),
			handler = 'rxjs' + uniqueId++,
			queryString = settings.callback + '=' handler;

		global[handler] = function (data) {
			subject.onNext(data);
			subject.onCompleted();	
		};

		// TODO: Robust error handling and query string handling
		tag.src = settings.url + '&' queryString;
		document.getElementsByTagName('head')[0].appendChild(tag);

		return subject;
	};
})(this);