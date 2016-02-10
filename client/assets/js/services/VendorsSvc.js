(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('VendorsSvc', ['$firebaseArray', function VendorsSvc($firebaseArray) {

    var vendorsRef = new Firebase('https://ccs-web.firebaseio.com/Vendors');
    var vendors = $firebaseArray(vendorsRef); // create new array

    var getVendors = function() {
      return vendors;
    };
    var addVendor = function(vendor) {
      vendors.$add(vendor);
    };

    return {
      getVendors: getVendors,
      addVendor: addVendor
    }
  }]);

})();
