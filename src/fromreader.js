dom.fromReader = function(file, progressObserver) {

    if (!root.FileReader) { throw new TypeError('FileReader not implemented in your runtime.'); }

    function _fromReader(readerFn, file, encoding) {
        return new AnonymousObservable(function(observer){
            var reader = new root.FileReader();
            var subject = new AsyncSubject();

            function loadHandler(e) {
                if (progressObserver)
                    progressObserver.onCompleted();

                var buf = e.target.result;

                subject.onNext(buf);
                subject.onCompleted();
            }

            function errorHandler(e) {
                subject.onError(e.target.error);
            }

            function progressHandler(e) {
                progressObserver.onNext(e);
            }

            reader.addEventListener('load', loadHandler, false);
            reader.addEventListener('error', errorHandler, false);

            if(progressObserver) {
                reader.addEventListener('progress', progressHandler, false);
            }

            //console.log(readerFn);
            readerFn.call(reader, file, encoding);

            return new CompositeDisposable(subject.subscribe(observer),
                disposableCreate(function(){
                    if (reader.readyState == root.FileReader.LOADING)
                        reader.abort();

                    reader.removeEventListener('load', loadHandler, false);
                    reader.removeEventListener('error', errorHandler, false);
                    reader.removeEventListener('progress', progressHandler, false);
                }));
        });
    }

    return {
        asArrayBuffer : function() {
            return _fromReader(root.FileReader.prototype.readAsArrayBuffer, file);
        },
        asBinaryString : function() {
            return _fromReader(root.FileReader.prototype.readAsBinaryString, file);
        },
        asDataURL : function() {
            return _fromReader(root.FileReader.prototype.readAsDataURL, file);
        },
        asText : function(encoding) {
            //console.log(root.FileReader.prototype);
            return _fromReader(root.FileReader.prototype.readAsText, file, encoding);
        }
    };

};