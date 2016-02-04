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
