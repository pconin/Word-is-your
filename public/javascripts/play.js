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
var wait = 0;
var finalColor = null;
var finalText = null;
$('#score').html(score);

//déclarations des fonctions

// popup bonne / mauvaise reponse
var popup = function(success){
  if (success === 1){
    $("#success").show();
    setTimeout(function() { $("#success").hide(); }, 1500);
  }
  else if (success === 0){
    $('#fail').show();
    setTimeout(function() { $("#fail").hide(); }, 1500);
  }
}

//appel au serveur qui renvoit un couple de mots
var getWords = function(diff){
  socket.emit('getWords', { diff : diff});
  wait = 1;
  socket.on('sendWords', function(response){
    if (wait === 1){
      wait = 0;
      console.log('Bonne réponse: ' + JSON.stringify(response.word.word_en) + ' Difficulté: ' + response.word.difficulty);
      var word = response.word;

      // on vérifie que le mot n'a pas déjà été tiré
      if (wordArray.indexOf(word.word_id) !== -1){
          // si le tableau de mots est trop rempli on le reinitalise pour opti
          if (wordArray.length > 50){
            wordArray = [];
            console.log('Reinit word array');
          }
          return getWords(diff);
      }
      else{
        wordArray.push(word.word_id);
        word_fr = word.word_fr;
        word_en = word.word_en;
        firstchar = word.word_en[0];
        wordlen = word.word_en.length;
        while (wordlen > 1){
          firstchar += '_';
          wordlen--;
        }
        $('#word_fr').html(word.word_fr);

        $('#word_en').html(firstchar);
        return ;
      }
    }
  });
}


//reinitialisation des stats
var restart = function(){
  wordArray = [];
  score = 10;
  $('#score').html(score);
  getWords(0);
}


//fin du jeu
var finishAnimation = function(score){

  // on choisit le texte et la couleur en fonction du résultat final
  if (score === 20){
    color = 'green';
    finalText = 'Well done! Vous avez gagné! On la remet?';
  }
  else{
    color = 'red';
    finalText = 'Perdu... Encore un effort, la prochaine sera la bonne!';
  }
  //on affiche la popup
  $('.popup_block').css('border', '20px solid ' + color);
  $('#finalText').html(finalText);
  $('#end').show()
    .append('<a href="/play"><div class="blue_button">Rejouer</div></a>')
    .append('<a href="/"><div class="blue_button">Accueil</div></a>');

}

getWords(0);

// touche entrer pour valider la reponse
$('#user_res').keyup(function(e){
    if(e.keyCode == 13)
    {
        $('#submit').click();
    }
});

// gestion de la validation
$('#submit').click(function(){
  if (score < 20 && score > 0){

    // on enregistre la reponse et on reinit la textbox
    user_res = $('#user_res').val();
    $('#user_res').val('');

    // on check si c'est la bonne reponse
    if (user_res.toLowerCase() === word_en.toLowerCase()){
      //console.log('BONNE REPONSE');
      score++;
      success = 1;
    }
    else{
      //console.log('MAUVAISE REPONSE');
      score--;
      success = 0;
    }

    // on affiche le resultat de la reponse
    popup(success);
    $('#score').html(score);

    // on verifie si le jeu est terminé
    if (score <= 0 || score >= 20)
      return finishAnimation(score);
    else {
      return getWords(success);
    }
  }
})
