var exports = module.exports;

exports.handler = function(io){
  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('getWords', function (response) {
      console.log('Difficulty: ' + response.diff);
    });
  });
}
