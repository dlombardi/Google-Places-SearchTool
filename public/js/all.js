'use strict';

var app = angular.module('zenefits_challenge', ['angularSpinner', 'ngMessages', 'ui.materialize']);

app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setTheme('zenefits_orange', { color: '#FAAE42', radius: 10 });
}]);
'use strict';

app.controller('searchCtrl', ['$scope', '$log', function ($scope, $log) {
  var map = undefined;
  var service = undefined;
  var currentPosition = undefined;
  $scope.places;
  $scope.reload = false;

  (function () {
    $scope.navigatorLoad = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        currentPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        map = new google.maps.Map({
          center: currentPosition,
          zoom: 15
        });
        $scope.navigatorLoad = false;
        safeApply();
      });
    } else {
      $log.error("geolocation is not available!");
    }
  })();

  function safeApply() {
    if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
      $scope.$apply();
    }
  };

  $scope.search = function (queryString) {
    $scope.reload = false;
    if (!queryString) {
      swalError("no query provided");
      return;
    }
    $scope.places = [];
    $scope.placesLoad = true;
    var req = {
      location: currentPosition,
      radius: '200',
      query: queryString
    };
    service = new google.maps.places.PlacesService(map);
    service.textSearch(req, getResults);
  };

  function swalError(message) {
    swal({
      title: "Oops!",
      type: 'error',
      text: "no query provided!",
      timer: 1000,
      showConfirmButton: false });
  }

  function getResults(results, status, pagination) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var formattedPlaces = formatPhotos(results);
      $scope.places = formattedPlaces;
      $scope.placesLoad = false;
      $log.info($scope.places);
      $scope.reload = true;
      $scope.queryString = "";
      safeApply();
    } else {
      $log.err("places service is non operational");
    }
  };

  function formatPhotos(results) {
    var photoResults = results.map(function (place) {
      if (place.photos) {
        place.photo = place.photos[0].html_attributions[0].match(/https:\/\/.+?(?=")/i)[0];
      }
      if (place.price_level) {
        var dollar = "$";
        place.price = dollar.repeat(place.price_level);
      }
      return place;
    });
    return photoResults;
  }
}]);
'use strict';

app.filter('ratingQuality', function () {
  return function (input) {
    var int = parseInt(input);
    if (int <= 2.0) {
      return "bad";
    } else if (2.0 < int && int <= 3.5) {
      return "ok";
    } else {
      return "amazing";
    }
  };
});

app.filter('ratingExists', function () {
  return function (collection) {
    var filtered = [];
    angular.forEach(collection, function (place) {
      if (place.hasOwnProperty('rating')) {
        filtered.push(place);
      }
    });
    filtered.sort(function (a, b) {
      return b.rating - a.rating;
    });
    return filtered;
  };
});