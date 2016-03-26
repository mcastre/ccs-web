(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('AuthSvc', ['$firebaseAuth', function AuthSvc($firebaseAuth) {

    var ref = new Firebase('https://ccs-web.firebaseio.com');
    return $firebaseAuth(ref);

  }]);

})();
