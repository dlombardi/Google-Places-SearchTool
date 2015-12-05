'use strict';

app.filter('ratingQuality', () => {
  return (input) => {
    var int = parseInt(input);
    if(int <= 2.0){
      return "bad";
    } else if (2.0 < int && int <= 3.5) {
      return "ok";
    } else {
      return "amazing";
    }
  };
});

app.filter('ratingExists', () => {
  return (collection) => {
    let filtered = [];
    angular.forEach(collection, (place) =>{
      if(place.hasOwnProperty('rating')){
        filtered.push(place);
      }
    })
    filtered.sort(function(a, b){
      return b.rating - a.rating;
    });
    return filtered;
  };
});
