let app = angular.module('google_places_search', ['angularSpinner', 'ngMessages', 'ui.materialize']);


app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setTheme('zenefits_orange', {color: '#FAAE42', radius: 10});
}]);
