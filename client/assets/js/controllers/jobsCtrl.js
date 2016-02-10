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
