(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('HomeCtrl', ['$scope', 'ProjectsSvc', 'JobsSvc', '$stateParams', function(scope, ProjectsSvc, JobsSvc, $stateParams) {

    var home = this;
    home.projects = ProjectsSvc.getProjects();
    
    // Get Jobs
    home.jobs = JobsSvc.getJobs();

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
