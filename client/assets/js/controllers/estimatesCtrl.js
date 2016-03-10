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
