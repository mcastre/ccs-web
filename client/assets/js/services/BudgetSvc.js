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
