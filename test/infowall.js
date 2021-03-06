// Generated by CozyScript 0.1.1
(function() {
  var assert;

  assert = require('assert');

  describe('InfoWall', function() {
    describe('#update()', function() {
      return it('should construct mqueues withour error', function() {
        var InfoWall, infowall;
        InfoWall = require('../infowall');
        infowall = new InfoWall.InfoWall;
        return infowall.update();
      });
    });
    return describe('#()', function() {
      return it('should construct mqueues for all markers', function(done) {
        var InfoWall, infowall;
        InfoWall = require('../infowall');
        infowall = new InfoWall.InfoWall;
        return infowall.update(function(mqueues) {
          var marker, _i, _len, _ref;
          _ref = infowall.get_markers();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            marker = _ref[_i];
            assert(mqueues[marker.name] != null);
          }
          return done();
        });
      });
    });
  });

}).call(this);
