(function() {
  'use strict';

  var app = angular.module('application');
  app.controller('HomeCtrl', ['$scope', '$firebaseArray', function(scope, $firebaseArray) {

    var home = scope;
    var firebaseURI = 'https://ccs-web.firebaseio.com/';
    var ref = new Firebase(firebaseURI + 'Projects');
    home.headingText = 'Project Dashboard';

    home.newProject = {
      dateCreated: Firebase.ServerValue.TIMESTAMP,
      name: 'Botanical Place',
      address: '245 Botanical Place, Birmingham, AL 35210',
      status: 'In Progress'
    };
    home.anotherProject = {
      dateCreated: Firebase.ServerValue.TIMESTAMP,
      name: 'Vestavia 2224',
      address: '1255 Vestavia Blvd, Vestavia, AL 35216',
      status: 'Awaiting Client'
    };
    //ref.push(home.anotherProject);    

    home.projects = $firebaseArray(ref);

  }]);

})();
