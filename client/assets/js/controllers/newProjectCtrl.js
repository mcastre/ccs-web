(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('NewProjectCtrl', ['$scope', '$stateParams', '$firebaseObject', 'ProjectsSvc', 'JobsSvc', 'ClientsSvc', 'VendorsSvc', 'AuthSvc', 'FoundationApi', '$state', function(scope, $stateParams, $firebaseObject, ProjectsSvc, JobsSvc, ClientsSvc, VendorsSvc, AuthSvc, FoundationApi, $state) {

    var pathId = $stateParams.id;

    var firebaseURIClients = 'https://ccs-web.firebaseio.com/Clients';
    var clientRef = new Firebase(firebaseURIClients);

    var firebaseURIVendors = 'https://ccs-web.firebaseio.com/Vendors';
    var vendorRef = new Firebase(firebaseURIVendors);

    var wizard = this;
    var firebaseURIProjects = 'https://ccs-web.firebaseio.com/Projects/' + pathId;
    var projectRef = new Firebase(firebaseURIProjects);

    wizard.userName = '';

    wizard.auth = AuthSvc.$getAuth();

    if (wizard.auth.password.email == 'mcastre3@gmail.com') {
      wizard.userName = 'Martín Castre';
    } else if (wizard.auth.password.email == 'armando@castre.net') {
      wizard.userName = 'Armando Castre';
    }


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

    wizard.logout = function() {
      wizard.auth.$unauth();
      FoundationApi.publish('main-notifications', {
        autoclose: 8000,
        content: 'You have been successfully logged out.',
        color: 'success'
      });
      $state.go('login');
    };

  }]);

})();
