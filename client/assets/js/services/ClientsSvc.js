(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('ClientsSvc', ['$firebaseArray', function ClientsSvc($firebaseArray) {

    var firebaseURI = 'https://ccs-web.firebaseio.com/Clients';
    var ref = new Firebase(firebaseURI);
    var clients = $firebaseArray(ref); // create new array

    var getClients = function() {
      return clients;
    };
    var addClient = function(client) {
      clients.$add(client);
    };

    return {
      getClients: getClients,
      addClient: addClient
    }
  }]);

})();
