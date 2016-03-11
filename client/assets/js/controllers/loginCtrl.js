(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('LoginCtrl', ['$scope', '$firebaseAuth', 'FoundationApi', '$state', function(scope, $firebaseAuth, FoundationApi, $state) {

    var login = this;
    var ref = new Firebase('https://ccs-web.firebaseio.com');
    var auth = $firebaseAuth(ref);
    login.isAuthError = false;
    login.theError = '';

    login.authData = ref.getAuth();

    login.authHandler = function(error, authData) {
      if (error) {
        login.isAuthError = true;
        console.log('User ' + authData + " is logged in.");
      } else {
        console.log('User logged out.');
      }
    };

    login.credentials = {
      email: '',
      password: ''
    };


    login.login = function(isValid) {
      if (isValid) {
        auth.$authWithPassword(login.credentials, login.authHandler).then(function(authData) {
          if (authData.password.email === "mcastre3@gmail.com") {
            authData.password.name = 'Martín Castre';
          } else if (authData.password.email === "armando@castre.net") {
            authData.password.name = 'Armando Castre';
          }
          FoundationApi.publish('main-notifications', {
            autoclose: 8000,
            content: 'Login successful. Welcome ' + authData.password.name + '!',
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
