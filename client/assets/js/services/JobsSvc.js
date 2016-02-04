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
