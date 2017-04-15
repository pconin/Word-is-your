var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

var getWords = function(diff){
  socket.emit('getWords', { diff : diff});
}

var initGame = function(start){
  var score = 0;

  start(score);
}

getWords(0);
initGame();
