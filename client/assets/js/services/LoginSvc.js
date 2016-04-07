(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('LoginSvc', ['$firebaseAuth', '$state', function LoginSvc($firebaseAuth, $state) {

    var user = {};
    var root = new Firebase('https://ccs-web.firebaseio.com');
    var ref = $firebaseAuth(root); // create new array

    var getUser = function() {
      if (user == {}) {
        if (typeof localStorage === 'object') {
          try {
            user = localStorage.getItem('userEmail');
          } catch(e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function() {};
          }
        }

        if (user.password.email === "mcastre3@gmail.com") {
          return 'Martín Castre';
        } else if (user.password.email === "armando@castre.net") {
          return 'Armando Castre';
        }

      }
      return user;
    };
    var setUser = function(value) {
      if (typeof localStorage === 'object') {
        try {
          localStorage.setItem('userEmail', value);
        } catch(e) {
          Storage.prototype._setItem = Storage.prototype.setItem;
          Storage.prototype.setItem = function() {};
        }
      }
      user = value;
    };
    var logout = function() {
      ref.$unauth();
      user = {};
      if (typeof localStorage === 'object') {
        try {
          localStorage.removeItem('userEmail');
        } catch(e) {
          Storage.prototype._setItem = Storage.prototype.setItem;
          Storage.prototype.setItem = function() {};
        }
      }
      $state.go('login');
    };

    return {
      getUser: getUser,
      setUser: setUser,
      logout: logout
    };
  }]);

})();
