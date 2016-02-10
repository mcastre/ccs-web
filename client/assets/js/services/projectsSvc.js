(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('ProjectsSvc', ['$stateParams', '$firebaseArray', 'FoundationApi', '$state', function ProjectsSvc($stateParams, $firebaseArray, FoundationApi, $state) {

    var randomInt = Math.round(Math.random() * 999);
    var newInt = randomInt.toString();
    var projectId = 'project_' + newInt;

    var pathId = $stateParams.id;

    var firebaseURI = 'https://ccs-web.firebaseio.com';
    var ref = new Firebase(firebaseURI);
    var projectRef = ref.child('Projects');
    var newProjectRef = ref.child('Projects').child(projectId);

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

    // NOTES REF

    var firebaseURINotes = 'https://ccs-web.firebaseio.com/Projects/' + pathId;
    var notesRef = new Firebase(firebaseURINotes);
    var newNotesRef = notesRef.child('Notes');
    var notes = $firebaseArray(newNotesRef);

    var getNotes = function() {
      return notes;
    };
    var addNote = function(note) {
      newNotesRef.push(note);
    };

    return {
      getProjects: getProjects,
      addProject: addProject,
      getNotes: getNotes,
      addNote: addNote
    }
  }]);

})();
