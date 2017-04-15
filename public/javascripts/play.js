var socket = io.connect('http://localhost:3000');



var wordArray = [];
var score = 0;

var getWords = function(diff){
  socket.emit('getWords', { diff : diff});
  socket.on('sendWords', function(response){
    console.log('sendwords: ' + JSON.stringify(response));
    var word = response.word;

    // on vérifie que le mot n'a pas déjà été tiré
    if (wordArray.indexOf(word.word_id) !== -1){
        console.log('Le mot a déjà été tiré. on en cherche un nouveau');
        // si le tableau de mots est trop rempli on le reinitalise pour opti
        if (wordArray.length > 400)
          wordArray = [];
        return getWords(diff);
    }
    else{
      wordArray.push(word.word_id);

      // affichage
    }
    console.log('word array : ' + wordArray);
  });
}


getWords(0);
