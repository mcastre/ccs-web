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
  app.controller('HomeCtrl', ['$scope', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', '$stateParams', function(scope, ProjectsSvc, JobsSvc, ClientsSvc, $stateParams) {

    var home = this;

    //Get Projects
    home.projects = ProjectsSvc.getProjects();

    // Get Jobs
    home.jobs = JobsSvc.getJobs();

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

(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('NewProjectCtrl', ['$scope', '$stateParams', '$firebaseObject', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', 'VendorsSvc', function(scope, $stateParams, $firebaseObject, ProjectsSvc, JobsSvc, ClientsSvc, VendorsSvc) {

    var pathId = $stateParams.id;

    var firebaseURIClients = 'https://ccs-web.firebaseio.com/Clients';
    var clientRef = new Firebase(firebaseURIClients);

    var firebaseURIVendors = 'https://ccs-web.firebaseio.com/Vendors';
    var vendorRef = new Firebase(firebaseURIVendors);

    var wizard = this;
    var firebaseURIProjects = 'https://ccs-web.firebaseio.com/Projects/' + pathId;
    var projectRef = new Firebase(firebaseURIProjects);


    wizard.allProjects = ProjectsSvc.getProjects();

    wizard.data = $firebaseObject(projectRef);

    // WIZARD TABS  -----------------------------------------
    // =============================================================

    wizard.tabs = [
      {
        title: 'Project Details',
        mobileTitle: 'Details',
        url: 'templates/build-details.html',
        cssColor: 'details'
      }
    ];
    wizard.currentTab = wizard.tabs[0];
    wizard.onClickTab = function(tab) {
      wizard.currentTab = tab;
    };
    wizard.isActiveTab = function(tabUrl) {
      return tabUrl === wizard.currentTab.url;
    };

    // PROJECT BUILD MAIN FORM  ------------------------------------
    // =============================================================

    // ngModel Form Objects
    wizard.build = {
      dateCreated: Date.now()
    };

    wizard.buildProjectDetails = function(isValid) {
      if (isValid) {
        console.log('here');
        ProjectsSvc.addProject(wizard.build);
        wizard.build = {};
      }
    };

    // ADD CLIENT NG-FORM  -----------------------------------------
    // =============================================================

    wizard.newClient = {};
    wizard.showAddClientAlert = false;

    wizard.addClient = function() {
      ClientsSvc.addClient(wizard.newClient);
      wizard.newClient = {};
      wizard.showAddClientAlert = true;
    };

    // ADD VENDOR NG-FORM  -----------------------------------------
    // =============================================================

    wizard.newVendor = {};
    wizard.showAddVendorAlert = false;

    wizard.addVendor = function() {
      VendorsSvc.addVendor(wizard.newVendor);
      wizard.newVendor = {};
      wizard.showAddVendorAlert = true;
    };

    // JOBS
    wizard.jobs = JobsSvc.getJobs();

    wizard.jobDetails = null;
    wizard.theJob = { name: '', exterior: '', interior: '', supplies: '' };

    wizard.addJob = function(isValid) {
      if (isValid) {
        JobsSvc.addJob(angular.copy(wizard.theJob));
        wizard.theJob = { name: '', exterior: '', interior: '', supplies: '' };
      }
    };
    wizard.toggle = {item: -1};
    wizard.addSelected = true;
    wizard.selectAddJob = function() {
      wizard.addSelected = !wizard.addSelected;
    };
    wizard.clients = ClientsSvc.getClients();
    wizard.vendors = VendorsSvc.getVendors();

  }]);

})();

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

(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('ClientsSvc', ['$firebaseArray', function ClientsSvc($firebaseArray) {

    var firebaseURI = 'https://ccs-web.firebaseio.com/Clients';
    var ref = new Firebase(firebaseURI);
    var clients = $firebaseArray(ref); // create new array

    var getClients = function() {
      return clients;
    };
    var addClient = function(client) {
      clients.$add(client);
    };

    return {
      getClients: getClients,
      addClient: addClient
    }
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
    var getExpenses = function() {
      return expenses;
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
      getExpenses: getExpenses,
      addJob: addJob,
      selectedJob: selectedJob
    }
  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('ProjectsSvc', ['$stateParams', '$firebaseArray', 'FoundationApi', '$state', function ProjectsSvc($stateParams, $firebaseArray, FoundationApi, $state) {

    var pathId = $stateParams.id;

    var firebaseURI = 'https://ccs-web.firebaseio.com';
    var ref = new Firebase(firebaseURI);
    var projectRef = ref.child('Projects');

    var projects = $firebaseArray(projectRef);

    var getProjects = function() {
      return projects;
    };
    var addProject = function(project) {
      projects.$add(project).then(function(ref) {
        var id = ref.key();
        console.log('Added record with ID of: ' + id);        
        $state.go('project', {'id': id});
      });
      FoundationApi.publish('main-notifications', {
        autoclose: 8000,
        title: 'Success! ',
        content: project.name + ' has been created.',
        color: 'success'
      });
    };

    return {
      getProjects: getProjects,
      addProject: addProject
    }
  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('VendorsSvc', ['$firebaseArray', function VendorsSvc($firebaseArray) {

    var firebaseURI = 'https://ccs-web.firebaseio.com/Vendors';
    var ref = new Firebase(firebaseURI);
    var vendors = $firebaseArray(ref); // create new array

    var getVendors = function() {
      return vendors;
    };
    var addVendor = function(vendor) {
      vendors.$add(vendor);
    };

    return {
      getVendors: getVendors,
      addVendor: addVendor
    }
  }]);

})();
