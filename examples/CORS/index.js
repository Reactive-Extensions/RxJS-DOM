(function () {
  function getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
  }

  function main() {
    var result = document.querySelector('#result');

    var request = Rx.DOM.ajax({
      url: 'http://updates.html5rocks.com',
      crossDomain: true,
      async: true
    });

    request.subscribe(
      function (xhr) {
        result.textContent = 'Page Title: ' + getTitle(xhr.responseText);
      },
      function (err) {
        result.textContent = 'Error response: ' + xhr.message;
      }
    )
  }

  Rx.DOM.ready().subscribe(main);
}());
