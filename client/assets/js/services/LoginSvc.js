(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('LoginSvc', ['$firebaseAuth', '$state', function LoginSvc($firebaseAuth, $state) {

    var user = {};
    var root = new Firebase('https://ccs-web.firebaseio.com');
    var ref = $firebaseAuth(root); // create new array

    var getUser = function() {
      if (user == {}) {
        user = localStorage.getItem('userEmail');        

        if (user.password.email === "mcastre3@gmail.com") {
          return 'Martín Castre';
        } else if (user.password.email === "armando@castre.net") {
          return 'Armando Castre';
        }

      }
      return user;
    };
    var setUser = function(value) {
      localStorage.setItem('userEmail', value);
      user = value;
    };
    var logout = function() {
      ref.$unauth();
      user = {};
      localStorage.removeItem('userEmail');
      console.log('Log out successful');
      $state.go('login');
    };

    return {
      getUser: getUser,
      setUser: setUser,
      logout: logout
    };
  }]);

})();
