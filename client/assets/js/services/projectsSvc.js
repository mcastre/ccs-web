(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('ProjectsSvc', ['$stateParams', '$firebaseArray', 'FoundationApi', '$state', function ProjectsSvc($stateParams, $firebaseArray, FoundationApi, $state) {

    var pathId = $stateParams.id;

    var firebaseURI = 'https://ccs-web.firebaseio.com';
    var ref = new Firebase(firebaseURI);
    var projectRef = ref.child('Projects');

    var projects = $firebaseArray(projectRef);

    var getProjects = function() {
      return projects;
    };
    var addProject = function(project) {
      projects.$add(project).then(function(ref) {
        var id = ref.key();
        console.log('Added record with ID of: ' + id);        
        $state.go('project', {'id': id});
      });
      FoundationApi.publish('main-notifications', {
        autoclose: 8000,
        title: 'Success! ',
        content: project.name + ' has been created.',
        color: 'success'
      });
    };

    return {
      getProjects: getProjects,
      addProject: addProject
    }
  }]);

})();
