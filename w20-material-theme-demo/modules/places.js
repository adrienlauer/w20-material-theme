define([
  'require',
  'module',

  '{lodash}/lodash',
  '{angular}/angular',

  '{w20-material-theme-demo}/modules/module',
  '{w20-material-theme-demo}/modules/resources/places-service'

], function(require, module, _, angular, demo) {
  'use strict';

  var _config = module && module.config() || {},
    angularModule = demo.module;

  angularModule.controller('PlaceController', ['$scope', '$route', '$timeout', 'PlacesService', '$log',
    function($scope, $route, $timeout, placesService, $log) {
      var queryPromise;

      $scope.places = []

      $scope.$on('w20.material.topbar.search.query', function(event, query) {
        if ($route.current.scope !== $scope)
          return;

        if (queryPromise && queryPromise.$$state.status == 0 /*Not Done*/ ) {
          $timeout.cancel(queryPromise);
          queryPromise = null;
        }
        queryPromise = $timeout(function() {
          placesService.geocode(query, function(err, result) {
            if (err)
              return $log.error(err.message, err);
            if (result)
              placesService.nearbySearch(result, 'store', function(err, results) {
                if (err)
                  return $log.error(err.message, err);
                $scope.$applyAsync(function() {
                  $scope.places = results;
                  $log.info($scope.places);
                });
              })
          })
        }, 200);
      });

      $scope.getDetails = function getDetails(place) {
        if (!place.expanded) {
          if (!place.detailed) {
            placesService.getDetails(place, function(err, details) {
              $scope.$applyAsync(function() {
                for (var prop in details) {
                  place[prop] = details[prop];
                }
                place.expanded = true;
                place.detailed = true;
                $log.info(place);
                if (place.photos && place.photos.length > 0) {
                  for (var i in place.photos) {
                    place.photos[i].url = place.photos[i].getUrl({ maxWidth: 200, maxHeight: 100 });
                  }
                }
              });
            });
          } else {
            place.expanded = true;
          }
        } else {
          place.expanded = false;
        }
      }
    }
  ]);

  return {
    lifecycle: {}
  };
});