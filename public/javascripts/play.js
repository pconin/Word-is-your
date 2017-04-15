//initialisation des variables
var socket = io.connect('http://localhost:3000');
//tableau pour eviter les doublons
var wordArray = [];
var score = 10;
var word_fr = null;
var word_en = null;
var firstchar = null;
var wordlen = null;
var user_res = null;
var success = 0;
$('#score').html(score);
$('#score').html(score);

//appel au serveur qui renvoit un couple de mots
var getWords = function(diff){
  socket.emit('getWords', { diff : diff});
  socket.on('sendWords', function(response){
    console.log('sendwords: ' + JSON.stringify(response));
    var word = response.word;

    // on vérifie que le mot n'a pas déjà été tiré
    if (wordArray.indexOf(word.word_id) !== -1){
        console.log('Le mot a déjà été tiré. on en cherche un nouveau');
        // si le tableau de mots est trop rempli on le reinitalise pour opti
        if (wordArray.length > 350)
          wordArray = [];
        return getWords(diff);
    }
    else{
      wordArray.push(word.word_id);
      word_fr = word.word_fr;
      word_en = word.word_en;
      firstchar = word.word_en[0];
      wordlen = word.word_en.length;
      $('#word_fr').html(word.word_fr);
      $('#word_en').html(firstchar + '     length:' + wordlen);
      return ;
    }
  });
}

//reinitialisation des stats
restart = function(){
  wordArray = [];
  score = 10;
  $('#score').html(score);
}

getWords(0);

// gestion de la validation
$('#submit').click(function(){
  user_res = $('#user_res').val();

  if (user_res.toLowerCase() === word_en.toLowerCase()){
    console.log('BONNE REPONSE');
    score++;
    success = 1;
  }
  else{
    console.log('MAUVAISE REPONSE');
    score--;
    success = 0;
  }
  return getWords(success);
})
