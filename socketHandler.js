var exports = module.exports;
let connection = require('./config/db');
var translate = require('node-google-translate-skidz'); // module gratuit de traduction

// fonction qui traduit le mot

translateWord = function(word, callback){
  translate({
    text: word.word_fr,
    source: 'fr',
    target: 'en'
  }, function(result) {
    word.word_en = result.translation;
    //on verifie que la traduction a marché
    if (word.word_en.toLowerCase() === word.word_fr.toLowerCase()){
      console.log(word.word_en + ' === ' + word.word_fr + ' so wrong traduction');
      // si la traduction n'est pas trouvée, on rappelle la fonction precedente.
      return getWordsFromDb(word.difficulty, callback);
    }
    else {
      return callback(word);
    }
  });


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
