(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('LoginCtrl', ['$scope', '$firebaseAuth', 'FoundationApi', '$state', 'LoginSvc', function(scope, $firebaseAuth, FoundationApi, $state, LoginSvc) {

    var login = this;
    var ref = new Firebase('https://ccs-web.firebaseio.com');
    var auth = $firebaseAuth(ref);
    login.isAuthError = false;
    login.theError = '';

    auth.$onAuth(function(authData) {
      if (authData) {
        LoginSvc.setUser(authData);
        $state.go('home');
      }
    });

    login.credentials = {
      email: '',
      password: ''
    };


    login.login = function(isValid) {
      var username = login.credentials.email;
      var password = login.credentials.password;

      if (isValid) {
        auth.$authWithPassword({
          email: username,
          password: password
        }).then(function(user) {
          if (username === "mcastre3@gmail.com") {
            user.password.name = 'Martín Castre';
          } else if (username === "armando@castre.net") {
            user.password.name = 'Armando Castre';
          }
          LoginSvc.setUser(user);
          FoundationApi.publish('main-notifications', {
            autoclose: 8000,
            content: 'Login successful. Welcome ' + user.password.name + '!',
            color: 'success'
          });
          $state.go('home');
        }).catch(function(error) {
          console.log(error);
          login.isAuthError = true;
          switch (error.code) {
            case 'INVALID_PASSWORD':
              login.theError = 'Uh oh. Looks like the password you entered is invalid.';
              return;
            case 'INVALID_EMAIL':
              login.theError = 'Uh oh. Looks like the email you entered is invalid.';
              return;
            case 'INVALID_USER':
              login.theError = 'Uh oh. Looks like the email you entered is invalid.';
              return;
            case 'UNKNOWN_ERROR':
              login.theError = 'Something went wrong. Please try again later.';
              return;
            default:
          }
        });
      }
    }
  }]);

})();
