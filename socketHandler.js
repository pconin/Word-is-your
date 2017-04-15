var exports = module.exports;
let connection = require('./config/db');
// fonction qui traduit le mot

translateWord = function(word, callback){
  word.word_en = 'traduction anglaise';

  callback(word);

  // si la traduction n'est pas trouvée, on rappelle la fonction precedente.
  //getWordsFromDb(word.difficulty, callback)
}

// fonction qui renvoit un couple de mot aleatoire issu de la DB
getWordsFromDb = function (diff, callback) {

  // on protege l'entrée
  if (diff !== 0 && diff !== 1)
    diff = 0;

  // on select un mot random de la bonne difficulté
  connection.query('SELECT * FROM `wiy`.`words` WHERE difficulty = ? ORDER BY RAND() LIMIT 1', [diff], function(err, word){
    if (err){
      throw err;
    } else{
      word = word[0];
      translateWord(word, callback);
    }
  })
}


// gestionnaire de sockets
exports.handler = function(io){
  io.on('connection', function (socket) {
    socket.on('getWords', function (response) {
      //console.log('Difficulty: ' + response.diff);
      getWordsFromDb(response.diff, function(word){
          //console.log('callback: ' + JSON.stringify(word));
          console.log('sendback')
          socket.emit('sendWords', { word: word });
      })

    });
  });
}
