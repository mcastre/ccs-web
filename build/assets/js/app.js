(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'firebase',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();

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

(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('JobsSvc', ['$stateParams', '$firebaseArray', function JobsSvc($stateParams, $firebaseArray) {

    var pathId = $stateParams.id;

    var firebaseURI = 'https://ccs-web.firebaseio.com/Projects/' + pathId;
    var projectRef = new Firebase(firebaseURI);
    var jobsRef = projectRef.child('Jobs');
    var jobs = $firebaseArray(jobsRef); // create new array

    var getJobs = function() {
      return jobs;
    };

    var addJob = function(job) {
      jobs.$add(job);
    };
    var selectedJob = function() {
      return {
        name: this.name,
        exterior: this.exterior,
        interior: this.interior,
        supplies: this.supplies
      }
    };
    return {
      getJobs: getJobs,
      addJob: addJob,
      selectedJob: selectedJob
    }
  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('ProjectsSvc', ['$stateParams', '$firebaseArray', function ProjectsSvc($stateParams, $firebaseArray) {

    var pathId = $stateParams.id;

    var firebaseURI = 'https://ccs-web.firebaseio.com/';
    var ref = new Firebase(firebaseURI + 'Projects');

    var projects = $firebaseArray(ref);

    var getProjects = function() {
      return projects;
    };

    return {
      getProjects: getProjects
    }
  }]);

})();
