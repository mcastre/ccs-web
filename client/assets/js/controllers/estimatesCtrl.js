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
