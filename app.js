// Generated by CozyScript 0.1.1
(function() {
  var InfoWall, app, compile, express, infowall, io, latest_diffs, latest_markers, nib, server, socket_clients, stylus, util;

  express = require('express');

  stylus = require('stylus');

  nib = require('nib');

  util = require('util');

  InfoWall = require('./infowall');

  app = express();

  server = require('http').createServer(app);

  io = require('socket.io').listen(server);

  latest_markers = {};

  latest_diffs = {};

  socket_clients = [];

  io.sockets.on('connection', function(socket) {
    socket_clients.push(socket);
    if (latest_markers !== {} && latest_diffs !== {}) {
      return socket.emit('ubike', [latest_markers, latest_diffs]);
    }
  });

  infowall = new InfoWall.InfoWall;

  infowall.update(function(mqueues, diffs) {
    latest_markers = infowall.get_markers();
    return latest_diffs = diffs;
  });

  infowall.start(function(mqueues, diffs) {
    var socket, _i, _len, _results;
    console.log(diffs);
    latest_markers = infowall.get_markers();
    latest_diffs = diffs;
    _results = [];
    for (_i = 0, _len = socket_clients.length; _i < _len; _i++) {
      socket = socket_clients[_i];
      _results.push(socket.emit('ubike', [latest_markers, latest_diffs]));
    }
    return _results;
  });

  compile = function(str, path) {
    return stylus(str).set('filename', path).use(nib());
  };

  app.set('views', __dirname + '/views');

  app.set('view engine', 'jade');

  app.set('view options', {
    layout: false
  });

  app.use(express.logger());

  app.use(express.bodyParser());

  app.use(express.cookieParser());

  app.use(express.session({
    secret: "tweetheapmap"
  }));

  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
  }));

  app.use(express["static"](__dirname + '/public'));

  app.use(function(error, req, res, next) {
    console.log(error);
    return res.send(500, {
      error: util.inspect(error)
    });
  });

  app.get('/', function(req, res) {
    return res.render('index');
  });

  server.listen(8088);

}).call(this);
