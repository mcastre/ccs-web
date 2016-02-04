(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('VendorsSvc', ['$firebaseArray', function VendorsSvc($firebaseArray) {

    var firebaseURI = 'https://ccs-web.firebaseio.com/Vendors';
    var ref = new Firebase(firebaseURI);
    var vendors = $firebaseArray(ref); // create new array

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
