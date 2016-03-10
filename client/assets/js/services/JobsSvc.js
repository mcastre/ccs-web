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
