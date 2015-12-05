app.controller('searchCtrl', ['$scope', '$log', ($scope, $log) => {
  let map
  let service;
  let currentPosition;
  $scope.places;
  $scope.reload = false;

  (() => {
    $scope.navigatorLoad = true;
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(pos =>{
        currentPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        map = new google.maps.Map({
           center: currentPosition,
           zoom: 15,
        });
        $scope.navigatorLoad = false;
        safeApply()
      });
    } else {
      $log.error("geolocation is not available!")
    }
  })();

  function safeApply(){
     if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
        $scope.$apply();
      }
  };

  $scope.search = (queryString) => {
    $scope.reload = false;
    if(!queryString){
      swalError("no query provided");
      return;
    }
    $scope.places = [];
    $scope.placesLoad = true
    let req = {
      location: currentPosition,
      radius: '200',
      query: queryString
    }
    service = new google.maps.places.PlacesService(map);
    service.textSearch(req, getResults);
  }

  function swalError(message){
    swal({
      title: "Oops!",
      type: 'error',
      text: "no query provided!",
      timer: 1000,
      showConfirmButton: false });
  }

  function getResults(results, status, pagination){
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      let formattedPlaces = formatPhotos(results);
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

  function formatPhotos(results){
    let photoResults = results.map(place => {
      if(place.photos){
        place.photo = place.photos[0].html_attributions[0].match(/https:\/\/.+?(?=")/i)[0];
      }
      if(place.price_level){
        let dollar = "$";
        place.price = dollar.repeat(place.price_level);
      }
      return place;
    })
    return photoResults;
  }

}]);
