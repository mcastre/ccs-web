(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('HomeCtrl', ['$scope', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', '$stateParams', '$state', 'AuthSvc', 'FoundationApi', 'LoginSvc', function(scope, ProjectsSvc, JobsSvc, ClientsSvc, $stateParams, $state, AuthSvc, FoundationApi, LoginSvc) {

    var home = this;
    var pathId = $stateParams.id;

    var ref = new Firebase('https://ccs-web.firebaseio.com');

    AuthSvc.$onAuth(function(authData) {
      if (authData) {
        console.log('Logged in', authData);
      } else {
        console.log('Logged out');
        $state.go('login');
      }
    });

    home.userName = '';

    home.auth = AuthSvc.$getAuth();

    if (home.auth.password.email == 'mcastre3@gmail.com') {
      home.userName = 'Martín Castre';
    } else if (home.auth.password.email == 'armando@castre.net') {
      home.userName = 'Armando Castre';
    }
    home.search = {
      query: ''
    };
    home.mobileSearch = false;
    home.toggleMobileSearch = function() {
      home.mobileSearch = !home.mobileSearch;
    };

    //Get Projects
    home.projects = ProjectsSvc.getProjects();

    // Get Clients
    home.clients = ClientsSvc.getClients();

    home.headingText = 'Project Dashboard';

    home.logout = function() {
      return LoginSvc.logout();
    };


  }]);

})();
