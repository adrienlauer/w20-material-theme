define([
  'require',
  'module',

  '{lodash}/lodash',
  '{angular}/angular',

  '{w20-material-theme-demo}/modules/module'

], function(require, module, _, angular, demo) {
  'use strict';

  var _config = module && module.config() || {},
    angularModule = demo.module;

  angularModule.factory('PlacesService', [
    function() {
      var geocoder = new google.maps.Geocoder(),
        map = new google.maps.Map(document.createElement('div')),
        placesService = new google.maps.places.PlacesService(map),
        _radius = 500;

      return {
        geocode: geocode,
        nearbySearch: nearbySearch,
        getDetails: getDetails,
        get radius() {
          return _radius;
        },
        set radius(val) {
          _radius = ~~val;
        }
      };

      function geocode(keyword, cb) {
        geocoder.geocode({ address: keyword }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            cb(null, results[0]);
          } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
            cb(null, undefined);
          } else {
            cb({
              message: "Geocoding was not succesful for the following reason: " + status,
              status: status
            })
          }
        });
      }

      function nearbySearch(request, type, cb) {
        placesService.nearbySearch({
          location: request.geometry.location,
          radius: _radius,
          type: type
        }, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            cb(null, results);
          } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            cb(null, []);
          } else {
            cb({
              message: "Radar search was not succesful for the following reason: " + status,
              status: status
            })
          }
        });
      }

      function getDetails(place, cb) {
        placesService.getDetails({
          placeId: place.place_id
        }, function(details, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            cb(null, details);
          } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            cb(null, undefined);
          } else {
            cb({
              message: "Details search was not succesful for the following reason: " + status,
              status: status
            })
          }
        });
      }
    }
  ]);

  return {
    lifecycle: {}
  };
});