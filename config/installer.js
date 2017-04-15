let connection = require('./db');
let fs = require('fs');

var exports = module.exports;

useDB = function (callback) {
  console.log('This is database installer');
  connection.query('DROP DATABASE IF EXISTS wiy;'+
      ' CREATE DATABASE wiy;'+
      ' CREATE TABLE `wiy`.`words` ( `word_id` INT(10) NOT NULL AUTO_INCREMENT , `word` VARCHAR(40) NOT NULL , `difficulty` INT(3) NOT NULL, PRIMARY KEY (`word_id`)) ENGINE = InnoDB;'+
      ' USE wiy;',
      function(err) {
        if (err){
          return console.log('Erreur initialization database: ' + err);
        }
        else {
          console.log('DB drop create and use OK');
          return callback();
        }
  });
}

fillDB = function () {
  var filename = 'verbe.txt';
  // on verifie si le fichier existe
  fs.stat(filename, function(err, stat) {
    if(err) {
        console.log(filename + ' doesn\'t exists');
    }else {
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
          else {
            // on parse le fichier et on insere les 500 premiers mots dans un tableau
            var wordsArray = data.trim().split(/\s+/).slice(0, 500);
            wordsArray.forEach(function(word){

              // on assigne une difficulté aléatoire
              var difficulty = Math.floor(Math.random() * (2 - 0) + 0);

              // on insere dans la db
              connection.query('INSERT INTO `wiy`.`words` (word, difficulty) VALUES (?,?)',[word, difficulty], function(err) {
                if (err){
                  console.log('Erreur ajout de \''+word+'\' dans la database: ' + err);
                }
              });
            });
            console.log('Database filled');
          }

      });
    }
  });
}

exports.installDB = function () {
  useDB(fillDB);
}
