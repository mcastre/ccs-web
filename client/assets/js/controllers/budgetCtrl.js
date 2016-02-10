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

    budget.addExpense = function(job) {            
      BudgetSvc.addExpense(angular.copy(budget.newExpense));
      budget.newExpense = { item: '', price: 0 };
    };

  }]);

})();
