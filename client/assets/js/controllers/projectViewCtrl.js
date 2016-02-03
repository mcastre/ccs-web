(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('ProjectViewCtrl', ['$scope', '$stateParams', '$firebaseObject', 'ProjectsSvc', 'JobsSvc', 'FoundationApi', function(scope, $stateParams, $firebaseObject, ProjectsSvc, JobsSvc, foundationApi) {

    var pathId = $stateParams.id;

    var project = this;
    var firebaseURI = 'https://ccs-web.firebaseio.com/Projects/' + pathId;
    var projectRef = new Firebase(firebaseURI);

    project.allProjects = ProjectsSvc.getProjects();

    project.data = $firebaseObject(projectRef);

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
  }]);

})();
