(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('HomeCtrl', ['$scope', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', '$stateParams', function(scope, ProjectsSvc, JobsSvc, ClientsSvc, $stateParams) {

    var home = this;
    var pathId = $stateParams.id;
    home.search = {
      query: ''
    };

    //Get Projects
    home.projects = ProjectsSvc.getProjects();

    // Get Clients
    home.clients = ClientsSvc.getClients();

    home.headingText = 'Project Dashboard';

    home.newProject = {
      dateCreated: Firebase.ServerValue.TIMESTAMP,
      name: 'Botanical Place',
      address: '245 Botanical Place, Birmingham, AL 35210',
      status: 'In Progress'
    };
    home.anotherProject = {
      dateCreated: Firebase.ServerValue.TIMESTAMP,
      name: 'Vestavia 2224',
      address: '1255 Vestavia Blvd, Vestavia, AL 35216',
      status: 'Awaiting Client'
    };

  }]);

})();
