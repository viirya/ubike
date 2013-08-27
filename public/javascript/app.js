// Generated by CozyScript 0.1.1
(function() {
  var UbikeMap, app,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = angular.module('ubike-web', ['ngRoute', 'ngResource', 'ngAnimate']);

  app.controller('UbikeCtrl', function($scope, $resource) {
    $scope.stations = [];
    $scope.markers = {};
    $scope.valley_time = {};
    $scope.current_station_name = "";
    $scope.predicate = "bike";
    $scope.station_name = "";
    window.update = function(new_markers, new_diffs, new_valley_time) {
      var marker, station, station_name, _i, _len;
      $scope.stations = [];
      for (station_name in new_diffs) {
        station = new_diffs[station_name];
        station['name'] = station_name;
        $scope.stations.push(station);
      }
      for (_i = 0, _len = new_markers.length; _i < _len; _i++) {
        marker = new_markers[_i];
        $scope.markers[marker.name] = marker;
      }
      $scope.valley_time = new_valley_time;
      return $scope.$apply();
    };
    $scope.change = function() {
      return console.log('scope change');
    };
    $scope.filter_max = function(station) {
      if ($scope.predicate === "bike") {
        return station.bike !== Number.MAX_VALUE;
      } else {
        return station.slot !== Number.MAX_VALUE;
      }
    };
    return $scope.click_station = function(station) {
      var lat, lng, marker;
      marker = $scope.markers[station];
      lat = marker['lat'];
      lng = marker['lng'];
      $scope.current_station_name = station;
      return window.map.set_center(lat, lng);
    };
  });

  UbikeMap = (function() {

    function UbikeMap(map_element_id) {
      this.put_marker = __bind(this.put_marker, this);
      this.show_info = __bind(this.show_info, this);
      this.set_center = __bind(this.set_center, this);
      this.get_markers = __bind(this.get_markers, this);
      this.redraw = __bind(this.redraw, this);
      this.setzoom = __bind(this.setzoom, this);
      var latlng, mapOptions;
      latlng = new google.maps.LatLng(-25.363882, 131.044922);
      mapOptions = {
        zoom: 17,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(document.getElementById(map_element_id), mapOptions);
      this.markers = {};
      this.infowindow = new google.maps.InfoWindow();
    }

    UbikeMap.prototype.setzoom = function(level) {
      return this.map.setZoom(level);
    };

    UbikeMap.prototype.redraw = function() {
      console.log('redraw');
      return google.maps.event.trigger(this.map, 'resize');
    };

    UbikeMap.prototype.get_markers = function() {
      return this.markers;
    };

    UbikeMap.prototype.set_center = function(lat, lng) {
      var newlatlng;
      newlatlng = new google.maps.LatLng(lat, lng);
      return this.map.setCenter(newlatlng);
    };

    UbikeMap.prototype.show_info = function(name, html) {
      var marker,
        _this = this;
      if (this.markers[name] != null) {
        marker = this.markers[name];
        html = "<div class='infoboxonmap'><span class='info'>" + name + "</span></div>";
        return google.maps.event.addListener(marker, 'mouseover', function() {
          _this.infowindow.setContent(html);
          return _this.infowindow.open(_this.map, marker);
        });
      }
    };

    UbikeMap.prototype.put_marker = function(lat, lng, name) {
      var marker, modify_info, newlatlng,
        _this = this;
      newlatlng = new google.maps.LatLng(lat, lng);
      marker = new google.maps.Marker({
        position: newlatlng,
        map: this.map,
        icon: {
          url: 'images/bike.png',
          scaledSize: new google.maps.Size(50, 50)
        }
      });
      this.markers[name] = marker;
      modify_info = function() {
        var marker_itr, station, station_marker, _i, _len, _ref;
        station = window.diffs[name];
        station_marker = null;
        _ref = window.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker_itr = _ref[_i];
          if (marker_itr.name === name) {
            station_marker = marker_itr;
          }
        }
        $('#mapinfobox > span.station_name_info').text(name);
        $('#mapinfobox > span.station_tot_info').text('車輛：' + station_marker['tot']);
        $('#mapinfobox > span.station_sus_info').text('車位：' + station_marker['sus']);
        if (station.bike !== Number.MAX_VALUE && station.bike > 0 && (station_marker != null) && station_marker['sus'] !== '0') {
          $('#mapinfobox > span.station_tot_time_info').text("平均還車間隔：" + ((station.bike / 60).toFixed(2)) + " 分鐘");
        } else if (station.bike === 0 && (station_marker != null) && station_marker['sus'] !== '0') {
          $('#mapinfobox > span.station_tot_time_info').text("平均還車間隔：無資料");
        } else if ((station_marker != null) && station_marker['sus'] === '0') {
          $('#mapinfobox > span.station_tot_time_info').text("已無車位");
        }
        if (station.slot !== Number.MAX_VALUE && station.slot > 0 && (station_marker != null) && station_marker['tot'] !== '0') {
          return $('#mapinfobox > span.station_sus_time_info').text("平均借車間隔：" + ((station.slot / 60).toFixed(2)) + " 分鐘");
        } else if (station.slot === 0 && (station_marker != null) && station_marker['tot'] !== '0') {
          return $('#mapinfobox > span.station_sus_time_info').text("平均借車間隔：無資料");
        } else if ((station_marker != null) && station_marker['tot'] === '0') {
          return $('#mapinfobox > span.station_sus_time_info').text("已無車輛");
        }
      };
      google.maps.event.addListener(marker, 'click', function() {
        modify_info();
        _this.infowindow.setContent($('.infobox').html());
        return _this.infowindow.open(_this.map, marker);
      });
      return google.maps.event.addListener(marker, 'mouseover', function() {
        modify_info();
        _this.infowindow.setContent($('.infobox').html());
        return _this.infowindow.open(_this.map, marker);
      });
    };

    return UbikeMap;

  })();

  $(document).ready(function() {
    var init_vis, socket;
    window.current_marker = null;
    socket = io.connect('http://cml10.csie.ntu.edu.tw:8088');
    socket.on('ubike', function(data) {
      window.markers = data[0];
      window.diffs = data[1];
      window.valley_time = data[2];
      window.update(window.markers, window.diffs, window.valley_time);
      if (Object.keys(window.map.get_markers()).length !== markers.length) {
        markers.forEach(function(marker) {
          return window.map.put_marker(marker.lat, marker.lng, marker.name);
        });
      }
      return window.update_vis();
    });
    window.map = new UbikeMap('map-canvas');
    $(".fancybox").fancybox();
    init_vis = function() {
      var container, svg, title;
      svg = d3.select("#d3-canvas").append("svg").attr("width", 1000).attr("height", 800);
      window.container = container = svg.append("g").attr("transform", "translate(" + 50 + "," + 50 + ")");
      return title = container.append("text").attr("color", "red").attr("font-size", "30px").attr("transform", "translate(" + 10 + "," + -20 + ")").text("Ubike");
    };
    window.update_vis = function() {
      window.container.selectAll("rect").data(d3.range(0, window.markers.length, 1), function(d) {
        return window.markers[d]['name'];
      }).attr("width", function(d) {
        var n;
        n = window.markers[d]['name'];
        if ((window.diffs[n] != null) && window.diffs[n].bike !== 0 && window.diffs[n].bike !== Number.MAX_VALUE) {
          return window.diffs[n].bike;
        } else {
          return 0;
        }
      }).attr("height", '20px').attr('x', 10).attr('y', function(d) {
        return 25 * d;
      });
      window.container.selectAll("rect").data(d3.range(0, window.markers.length, 1), function(d) {
        return window.markers[d]['name'];
      }).enter().append('g').append("rect").attr("width", function(d) {
        var n;
        n = window.markers[d]['name'];
        if ((window.diffs[n] != null) && window.diffs[n].bike !== 0 && window.diffs[n].bike !== Number.MAX_VALUE) {
          return window.diffs[n].bike;
        } else {
          return 0;
        }
      }).attr("height", '20px').attr('x', 10).attr('y', function(d) {
        return 25 * d;
      });
      return window.container.selectAll('g').append('text').text(function(d) {
        return window.markers[d]['name'];
      }).attr('x', 20).attr('y', function(d) {
        return 25 * d + 16;
      });
    };
    return init_vis();
  });

}).call(this);
