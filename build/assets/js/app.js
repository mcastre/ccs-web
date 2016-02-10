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
  app.controller('BudgetCtrl', ['$scope', '$stateParams', '$firebaseArray', 'ProjectsSvc', 'JobsSvc', 'BudgetSvc', function(scope, $stateParams, $firebaseArray, ProjectsSvc, JobsSvc, BudgetSvc) {

    var budget = this;
    var pathId = $stateParams.id;

    // JOBS

    var projectRef = new Firebase('https://ccs-web.firebaseio.com/Projects/' + pathId + '/Jobs');
    var jobsRef = new Firebase('https://ccs-web.firebaseio.com/Jobs');

    budget.allJobs = {};
    projectRef.on('child_added', function(snap) {
      var jobId = snap.key();
      jobsRef.child(jobId).on('value', function(snap) {
        budget.allJobs[jobId] = snap.val();
      })
    });

    budget.newExpense = { item: '', price: 0 };

    budget.addExpense = function(name) {      
      jobsRef.child(name).child('Budget').push(budget.newExpense).then(function(ref) {
        var id = ref.key();
      });
      budget.newExpense = { item: '', price: 0 };
    };
  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('EstimatesCtrl', ['$scope', '$stateParams', '$firebaseObject', 'ProjectsSvc', 'JobsSvc', function(scope, $stateParams, $firebaseObject, ProjectsSvc, JobsSvc) {

    var estimates = this;

    // JOBS
    estimates.allJobs = JobsSvc.getJobs();

    estimates.jobDetails = null;

    estimates.toggle = {item: -1};


  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('HomeCtrl', ['$scope', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', '$stateParams', function(scope, ProjectsSvc, JobsSvc, ClientsSvc, $stateParams) {

    var home = this;
    var pathId = $stateParams.id;

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

(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('JobsCtrl', ['$scope', '$stateParams', '$firebaseObject', '$firebaseArray', 'ProjectsSvc', 'JobsSvc', function(scope, $stateParams, $firebaseObject, $firebaseArray, ProjectsSvc, JobsSvc) {

    var jobs = this;
    var pathId = $stateParams.id;

    // JOBS
    var projectRef = new Firebase('https://ccs-web.firebaseio.com/Projects/' + pathId + '/Jobs');
    var jobsRef = new Firebase('https://ccs-web.firebaseio.com/Jobs');

    jobs.allJobs = {};
    projectRef.on('child_added', function(snap) {
      var jobId = snap.key();
      jobsRef.child(jobId).on('value', function(snap) {
        jobs.allJobs[jobId] = snap.val();
      })
    });



    jobs.jobDetails = null;
    jobs.theJob = { name: '', exterior: '', interior: '' };

    jobs.addJob = function(isValid) {
      if (isValid) {
        JobsSvc.addJob(angular.copy(jobs.theJob));
        jobs.theJob = { name: '', exterior: '', interior: '' };
      }
    };
    jobs.toggle = {item: -1};
    jobs.addSelected = true;
    jobs.selectAddJob = function() {
      jobs.addSelected = !jobs.addSelected;
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
    wizard.clients = ClientsSvc.getClients();
    wizard.vendors = VendorsSvc.getVendors();

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

    // ADD CLIENT NG-FORM  -----------------------------------------
    // =============================================================

    wizard.newClient = {};
    wizard.showAddClientAlert = false;

    wizard.addClient = function() {
      console.log(wizard.newClient);
      ClientsSvc.addClient(angular.copy(wizard.newClient));
      wizard.newClient = {};
      wizard.showAddClientAlert = true;
    };

    // ADD VENDOR NG-FORM  -----------------------------------------
    // =============================================================

    wizard.newVendor = {};
    wizard.showAddVendorAlert = false;

    wizard.addVendor = function() {
      VendorsSvc.addVendor(angular.copy(wizard.newVendor));
      wizard.newVendor = {};
      wizard.showAddVendorAlert = true;
    };

    // PROJECT BUILD MAIN FORM  ------------------------------------
    // =============================================================

    // ngModel Form Objects

    wizard.build = {
      dateCreated: Date.now()
    };

    wizard.buildProjectDetails = function(isValid) {
      if (isValid) {
        ProjectsSvc.addProject(angular.copy(wizard.build));
        wizard.build = {};
      }
    };


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


    // NOTES
    // ===================================================

    project.notes = ProjectsSvc.getNotes();

    project.newNote = {
      dateCreated: Date.now()
    };
    project.addNewNote = function() {
      ProjectsSvc.addNote(angular.copy(project.newNote));
      project.newNote = {};
    };
    
    project.clients = ClientsSvc.getClients();

  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('BudgetSvc', ['$firebaseArray', '$stateParams', function BudgetSvc($firebaseArray, $stateParams) {

    var pathId = $stateParams.id;

    var firebaseURI = 'https://ccs-web.firebaseio.com/Projects/' + pathId;
    var jobsRef = new Firebase(firebaseURI);

    var budgetRef = new Firebase('https://ccs-web.firebaseio.com/Jobs');

    var budgets = $firebaseArray(budgetRef); // create new array

    var getBudgets = function() {
      return budgets;
    };
    var addExpense = function(job) {
      budgets.$add(job).then(function(ref) {
        var jobId = ref.key();
        budgets[jobId].id = jobId;
        budgets.$save(jobId);
      })
    };

    return {
      getBudgets: getBudgets,
      addExpense: addExpense
    }
  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('ClientsSvc', ['$firebaseArray', function ClientsSvc($firebaseArray) {

    var clientsRef = new Firebase('https://ccs-web.firebaseio.com/Clients');
    var clients = $firebaseArray(clientsRef); // create new array

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
  app.factory('JobsSvc', ['$stateParams', '$firebaseArray', 'FoundationApi', function JobsSvc($stateParams, $firebaseArray, FoundationApi) {

    var randomInt = Math.round(Math.random() * 999);
    var newInt = randomInt.toString();
    var jobId = 'job_' + newInt;

    var pathId = $stateParams.id;

    var projectRef = new Firebase('https://ccs-web.firebaseio.com/Projects/' + pathId );
    var jobsRef = new Firebase('https://ccs-web.firebaseio.com/Jobs');
    var jobs = $firebaseArray(jobsRef); // create new array

    var getJobs = function() {
      return jobs
    };

    var addJob = function(job) {
      var root = new Firebase('https://ccs-web.firebaseio.com/');
      var id = root.child('Jobs').push();
      id.set(job, function(err) {
        if (!err) {
          var name = id.key();
          root.child('/Projects/' + pathId + '/Jobs/' + name).set(true);
          FoundationApi.publish('main-notifications', {
            autoclose: 6000,
            title: 'Success! ',
            content: job.name + ' has been created',
            color: 'success'
          });
          id.once('value', function(snapshot) {
            var data = snapshot.exportVal();
            console.log(data);
          })
        }
      });
    };

    return {
      getJobs: getJobs,
      addJob: addJob
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

    // NOTES REF

    var firebaseURINotes = 'https://ccs-web.firebaseio.com/Projects/' + pathId;
    var notesRef = new Firebase(firebaseURINotes);
    var newNotesRef = notesRef.child('Notes');
    var notes = $firebaseArray(newNotesRef);

    var getNotes = function() {
      return notes;
    };
    var addNote = function(note) {
      newNotesRef.push(note);
    };

    return {
      getProjects: getProjects,
      addProject: addProject,
      getNotes: getNotes,
      addNote: addNote
    }
  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('VendorsSvc', ['$firebaseArray', function VendorsSvc($firebaseArray) {

    var vendorsRef = new Firebase('https://ccs-web.firebaseio.com/Vendors');
    var vendors = $firebaseArray(vendorsRef); // create new array

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
