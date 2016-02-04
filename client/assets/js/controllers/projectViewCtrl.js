(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('ProjectViewCtrl', ['$scope', '$stateParams', '$firebaseObject', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', function(scope, $stateParams, $firebaseObject, ProjectsSvc, JobsSvc, ClientsSvc) {

    var pathId = $stateParams.id;

    var firebaseURIClients = 'https://ccs-web.firebaseio.com/Clients/' + pathId;
    var clientRef = new Firebase(firebaseURIClients);

    var project = this;
    var firebaseURIProjects = 'https://ccs-web.firebaseio.com/Projects/' + pathId;
    var projectRef = new Firebase(firebaseURIProjects);


    project.allProjects = ProjectsSvc.getProjects();

    project.data = $firebaseObject(projectRef);
    project.clientData = $firebaseObject(clientRef);

    project.headingText = project.data.name;

    project.tabs = [
      {
        title: 'Project Details',
        mobileTitle: 'Details',
        url: 'templates/view-details.html',
        cssColor: 'details'
      },
      {
        title: 'Estimates',
        mobileTitle: 'Estimates',
        url: 'templates/view-estimates.html',
        ccsColor: 'estimates'
      },
      {
        title: 'Jobs',
        mobileTitle: 'Jobs',
        url: 'templates/view-jobs.html',
        ccsColor: 'jobs'
      },
      {
        title: 'Budget and Expenses',
        mobileTitle: 'Expenses',
        url: 'templates/view-budget.html',
        ccsColor: 'budget'
      }
    ];
    project.currentTab = project.tabs[0];
    project.onClickTab = function(tab) {
      project.currentTab = tab;
    };
    project.isActiveTab = function(tabUrl) {
      return tabUrl === project.currentTab.url;
    };

    // JOBS
    project.jobs = JobsSvc.getJobs();

    project.jobDetails = null;
    project.theJob = { name: '', exterior: '', interior: '', supplies: '' };

    project.addJob = function(isValid) {
      if (isValid) {
        JobsSvc.addJob(angular.copy(project.theJob));
        project.theJob = { name: '', exterior: '', interior: '', supplies: '' };
      }
    };
    project.toggle = {item: -1};
    project.addSelected = true;
    project.selectAddJob = function() {
      project.addSelected = !project.addSelected;
    };
    project.clients = ClientsSvc.getClients();

  }]);

})();
