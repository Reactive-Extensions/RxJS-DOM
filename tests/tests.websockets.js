module('Websocket');

test('Socket can send data', function () {
  var dummySocket = { 
    send : sinon.spy()
  };

  sinon.stub(window, 'WebSocket').returns(dummySocket);

  // TODO: Get real websocket data
});