// Generated by CozyScript 0.1.1
(function() {
  var Ubike, http, sax,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  sax = require('sax');

  http = require('http');

  Ubike = (function() {

    function Ubike() {
      this.request = __bind(this.request, this);
      this.parse_xml = __bind(this.parse_xml, this);
      this.search = __bind(this.search, this);
      this.get_markers = __bind(this.get_markers, this);      this.xml_source = 'http://www.youbike.com.tw/genxml9.php?lat=25.037525&lng=121.56378199999995&radius=5&mode=0';
      this.parser = sax.parser(true);
      this.markers = [];
    }

    Ubike.prototype.get_markers = function() {
      return this.markers;
    };

    Ubike.prototype.search = function(site_name) {
      var station, _i, _len, _ref;
      if ((this.markers != null)) {
        _ref = this.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          station = _ref[_i];
          if (station.name === site_name) {
            return station;
          }
        }
      }
      return [];
    };

    Ubike.prototype.parse_xml = function(xml, cb) {
      var _this = this;
      this.markers = [];
      this.parser.onclosetag = function(tagName) {};
      this.parser.onopentag = function(tag) {
        if ((tag.name != null) && tag.name === 'marker') {
          return _this.markers.push(tag.attributes);
        }
      };
      this.parser.ontext = function(text) {};
      this.parser.onend = function() {
        _this.ubike_stations = JSON.stringify(_this.markers);
        if ((cb != null)) {
          return cb();
        }
      };
      return this.parser.write(xml).end();
    };

    Ubike.prototype.request = function(cb) {
      var crawler,
        _this = this;
      this.data = '';
      crawler = function(res) {
        res.on('data', function(chunk) {
          return _this.data += chunk;
        });
        return res.on('end', function() {
          return _this.parse_xml(_this.data, cb);
        });
      };
      return http.get(this.xml_source, crawler).on('error', function(e) {
        console.log("Got error: " + e.message);
        throw e;
      });
    };

    return Ubike;

  })();

  exports.Ubike = Ubike;

}).call(this);
