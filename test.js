// Generated by CozyScript 0.1.1
(function() {
  var InfoWall, infowall;

  InfoWall = require('./infowall');

  infowall = new InfoWall.InfoWall;

  infowall.start(function(mqueues, diffs) {
    return console.log(diffs);
  });

  setTimeout(function() {
    return infowall.stop();
  }, 300000);

}).call(this);
