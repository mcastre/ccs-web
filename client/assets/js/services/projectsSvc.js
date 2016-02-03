(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('ProjectsSvc', ['$stateParams', '$firebaseArray', function ProjectsSvc($stateParams, $firebaseArray) {

    var pathId = $stateParams.id;

    var firebaseURI = 'https://ccs-web.firebaseio.com/';
    var ref = new Firebase(firebaseURI + 'Projects');

    var projects = $firebaseArray(ref);

    var getProjects = function() {
      return projects;
    };

    return {
      getProjects: getProjects
    }
  }]);

})();
