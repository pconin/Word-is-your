var express = require('express');
var app = express();
var server = require('http').Server(app);


var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var play = require('./routes/play');
var socket = require('./socketHandler');
var installer = require('./config/installer.js');

// configuration socket + serveur
var socket_io    = require("socket.io");
var io = require('socket.io')(server);

// on utilise ejs pour render du html (pas tres propre)
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// favicon madjoh
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// au lancement du serveur, la base de donnée est initialisée de manière asynchrone.
installer.installDB();

// on fait des routes pour les 2 pages
app.use('/', index);
app.use('/play', play);

// on appelle le module de gestion des sockets
socket.handler(io);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = {app: app, server: server};
