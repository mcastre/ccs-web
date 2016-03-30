(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('HomeCtrl', ['$scope', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', '$stateParams', '$state', 'AuthSvc', 'FoundationApi', 'LoginSvc', function(scope, ProjectsSvc, JobsSvc, ClientsSvc, $stateParams, $state, AuthSvc, FoundationApi, LoginSvc) {

    var home = this;
    var pathId = $stateParams.id;

    var ref = new Firebase('https://ccs-web.firebaseio.com');
    home.auth = AuthSvc;
    home.isAdmin = false;
    home.isUser = false;

    home.authData = home.auth.$getAuth();
    home.authData.password.name = '';

    home.getUserDetails = function() {
      if (home.authData.password.email === "mcastre3@gmail.com") {
        home.authData.password.name = 'Martín Castre';
        home.isAdmin = true;
      } else if (home.authData.password.email === "armando@castre.net") {
        home.authData.password.name = 'Armando Castre';
        home.isUser = true;
      }
    };
    home.getUserDetails();
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
