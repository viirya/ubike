// Generated by CozyScript 0.1.1
(function() {
  var app;

  app = angular.module('ubike-web', ['ngRoute', 'ngResource']);

  app.controller('UbikeCtrl', function($scope, $resource) {
    $scope.stations = {};
    $scope.predicate = "bike";
    $scope.station_name = "";
    window.update = function(new_data) {
      var station, station_name;
      $scope.stations = [];
      for (station_name in new_data) {
        station = new_data[station_name];
        station['name'] = station_name;
        $scope.stations.push(station);
      }
      return $scope.$apply();
    };
    $scope.change = function() {
      return console.log('scope change');
    };
    return $scope.filter_max = function(station) {
      if ($scope.predicate === "bike") {
        return station.bike !== Number.MAX_VALUE;
      } else {
        return station.slot !== Number.MAX_VALUE;
      }
    };
  });

  $(document).ready(function() {
    var socket;
    socket = io.connect('http://cml10.csie.ntu.edu.tw:8088');
    return socket.on('ubike', function(data) {
      return window.update(data);
    });
  });

}).call(this);
