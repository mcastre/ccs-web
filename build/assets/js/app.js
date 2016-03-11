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

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];

  function config($urlProvider, $locationProvider, $stateProvider) {
    $urlProvider.otherwise('/login');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl as login',
      // resolve: {
      //   "currentAuth": ["Auth", function(Auth) {
      //     return Auth.$requireAuth();
      //   }]
      // },
      animation: {
        enter: 'fadeIn, fadeOut',
        leave: 'fadeOut, fadeIn'
      }
    });

    $stateProvider.state('project', {
      url: '/project/:id',
      templateUrl: 'templates/project.html',
      controller: 'ProjectViewCtrl as project',
      // resolve: {
      //   "currentAuth": ["Auth", function(Auth) {
      //     return Auth.$waitForAuth();
      //   }]
      // },
      animation: {
        enter: 'fadeIn, slideInUp',
        leave: 'fadeOut, slideOutBottom'
      }
    });
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
  app.controller('EstimatesCtrl', ['$scope', '$stateParams', '$firebaseObject', 'ProjectsSvc', 'JobsSvc', 'RoomsSvc', 'FoundationApi', function(scope, $stateParams, $firebaseObject, ProjectsSvc, JobsSvc, RoomsSvc, FoundationApi) {

    var estimates = this;

    // JOBS
    // ==================

    var pathId = $stateParams.id;

    var projectRef = new Firebase('https://ccs-web.firebaseio.com/Projects/' + pathId + '/Jobs');
    var jobsRef = new Firebase('https://ccs-web.firebaseio.com/Jobs');

    estimates.allJobs = {};
    projectRef.on('child_added', function(snap) {
      var jobId = snap.key();
      jobsRef.child(jobId).on('value', function(snap) {
        estimates.allJobs[jobId] = snap.val();
      })
    });

    estimates.jobDetails = null;

    estimates.jobsToggle = {item: -1};

    // TABS
    // ==================

    estimates.tabs = [
      {
        title: 'Interior',
        url: 'interior.html'
      },
      {
        title: 'Exterior',
        url: 'exterior.html'
      }
    ];
    estimates.currentTab = 'interior.html';
    estimates.onClickTab = function(tab) {
      estimates.currentTab = tab.url;
    };
    estimates.isActiveTab = function(tabUrl) {
      return tabUrl == estimates.currentTab;
    };

    // ESTIMATES
    // ==================

    estimates.project = {
      Interior: {},
      Exterior: {}
    };

    estimates.cols = RoomsSvc.getColumns();
    estimates.rows = RoomsSvc.getRows();

    estimates.exteriorSides = RoomsSvc.getExteriorSides();
    estimates.exteriorSections = RoomsSvc.getExteriorSections();

    estimates.getId = function(id) {
      estimates.jobIdForEstimate = id;
      var estimateRef = jobsRef.child(id).child('Estimate');
      estimates.getEstimate = $firebaseObject(estimateRef);
    };

    estimates.addEstimate = function(name) {
      jobsRef.child(name).child('Estimate').set(estimates.project, function() {
        console.log('Set.');
      });
    };
    estimates.saveEstimate = function() {
      estimates.getEstimate.$save().then(function() {
        FoundationApi.publish('main-notifications', {
          autoclose: 8000,
          content: 'Estimate has been saved.',
          color: 'success'
        });
      }).catch(function(err) {
        console.log('Error: ', err);
      });
    }
  }]);

})();

(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('HomeCtrl', ['$scope', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', '$stateParams', '$firebaseAuth', '$state', 'FoundationApi', function(scope, ProjectsSvc, JobsSvc, ClientsSvc, $stateParams, $firebaseAuth, $state, FoundationApi) {

    var home = this;
    var pathId = $stateParams.id;

    var ref = new Firebase('https://ccs-web.firebaseio.com');
    var auth = $firebaseAuth(ref);
    home.isAdmin = false;
    home.isUser = false;

    home.authData = ref.getAuth();
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
      console.log('logging out');
      auth.$unauth();
      FoundationApi.publish('main-notifications', {
        autoclose: 8000,
        content: 'You have been successfully logged out.',
        color: 'success'
      });
      $state.go('login');
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
      });
    });



    jobs.jobDetails = null;
    jobs.theJob = { name: '', exterior: '', interior: '' };

    jobs.addJob = function(isValid) {
      if (isValid) {
        JobsSvc.addJob(angular.copy(jobs.theJob), pathId);
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

    project.isEditModeAddress = false;
    project.isEditModeStatus = false;

    project.toggleEditAddress = function() {
      project.isEditModeAddress = !project.isEditModeAddress;
    };
    project.toggleEditStatus = function() {
      project.isEditModeStatus = !project.isEditModeStatus;
    };

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

    // UPDATE
    // ==================================================

    project.updateAddress = function(newVal, child) {
      projectRef.child(child).update(newVal);
      project.isEditModeAddress = false;
    };
    project.updateStatus = function(newVal, child) {
      projectRef.child(child).set(newVal);
      project.isEditModeStatus = false;
    };


    // NOTES
    // ===================================================

    var projectNotesRef = new Firebase('https://ccs-web.firebaseio.com/Projects/' + pathId + '/Notes');
    var notesRef = new Firebase('https://ccs-web.firebaseio.com/Notes');

    project.notes = {};

    projectNotesRef.on('child_added', function(snap) {
      var notesId = snap.key();
      notesRef.child(notesId).on('value', function(snap) {
        project.notes[notesId] = snap.val();
      });
    });

    project.newNote = {
      dateCreated: Date.now()
    };
    project.addNewNote = function() {
      ProjectsSvc.addNote(angular.copy(project.newNote), pathId);
      project.newNote = {};
    };

    project.clients = ClientsSvc.getClients();

  }]);

})();

var app = angular.module('application');
app.directive('estimatesTable', ['RoomsSvc', function(RoomsSvc) {
  return {
    restrict: 'E',
    scope: {
      rows: '=',
      columns: '=',
      selectedElements: '=',
      tableTitle: '='
    },
    templateUrl: 'templates/estimates-table.html',
    link: function(scope, elem, attrs) {
      RoomsSvc.buildRooms(scope.rows, scope.columns);
      scope.roomToggle = false;
      scope.addRoomToggle = function() {
        scope.roomToggle = !scope.roomToggle;
      };
      scope.addRoom = function(room) {
        scope.rows.push({ 'name': room.name, 'id': scope.rows.length});
        RoomsSvc.buildRooms(scope.rows, scope.columns);
      };
    }
  }
}]);

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
      return jobs;
    };

    var addJob = function(job, projId) {
      var root = new Firebase('https://ccs-web.firebaseio.com/');
      var id = root.child('Jobs').push();
      id.set(job, function(err) {
        if (!err) {
          var name = id.key();
          root.child('Projects/' + projId + '/Jobs/' + name).set(true);
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
        project.id = id;
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

    var notesRef = ref.child('Notes');
    var notes = $firebaseArray(notesRef);

    var getNotes = function() {
      return notes;
    };

    var addNote = function(project, projId) {
      var root = new Firebase('https://ccs-web.firebaseio.com/');
      var id = root.child('Notes').push();
      id.set(project, function(err) {
        if (!err) {
          var name = id.key();
          root.child('Projects/' + projId + '/Notes/' + name).set(true);
          id.once('value', function(snapshot) {
            var data = snapshot.exportVal();
          })
        }
      });
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
  app.factory('RoomsSvc', function RoomsSvc() {

  function buildRooms(rows, cols) {    
    angular.forEach(rows, function(row) {
      row.elements = [];
      angular.forEach(cols, function(col) {
        row.elements.push({name: col, isSelected: false});
      });
    });
  };
  var cols = [
   "Walls",
   "Ceiling",
   "Doors",
   "Crown",
   "Windows",
   "Cabinets",
   "Other"
 ];
 var rows = [
    {
      "id": 0,
      "name": "Foyer",
      "isSelected": false
    },
    {
      "id": 1,
      "name": "Living",
      "isSelected": false
    },
    {
      "id": 2,
      "name": "Dining",
      "isSelected": false
    },
    {
      "id": 3,
      "name": "Hallway",
      "isSelected": false
    },
    {
      "id": 4,
      "name": "Bedroom",
      "isSelected": false
    },
    {
      "id": 5,
      "name": "Bathroom",
      "isSelected": false
    }
  ];
  var exteriorSides = [
    "Side 1",
    "Side 2",
    "Side 3",
    "Side 4",
    "Other"
  ];
  var exteriorSections = [
    {
      "id": 6,
      "name": "Siding",
      "isSelected": false
    },
    {
      "id": 7,
      "name": "Windows",
      "isSelected": false
    },
    {
      "id": 8,
      "name": "Trim",
      "isSelected": false
    },
    {
      "id": 9,
      "name": "Doors",
      "isSelected": false
    },
    {
      "id": 10,
      "name": "Other",
      "isSelected": false
    }
 ];

  var getColumns = function() {
    return cols;
  };
  var getRows = function() {
    return rows;
  };
  var getExteriorSides = function() {
    return exteriorSides;
  };
  var getExteriorSections = function() {
    return exteriorSections;
  };
  return {
    getColumns: getColumns,
    getRows: getRows,
    getExteriorSides: getExteriorSides,
    getExteriorSections: getExteriorSections,
    buildRooms: buildRooms
  }
  });

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
