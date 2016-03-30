var app = angular.module('application');
app.directive('profileAvatar', function() {
  return {
    restrict: 'E',
    scope: {
      userAuth: '=',
      avatarClass: '@'
    },
    templateUrl: 'templates/profile-avatar.html',
    link: function(scope, element, attrs) {      
      scope.isAdmin = false;
      scope.isUser = false;

      if (scope.userAuth.email == 'mcastre3@gmail.com') {
        scope.isAdmin = true;
        scope.userName = 'Martín Castre';
      } else if (scope.userAuth.email == 'armando@castre.net') {
        scope.isUser = true;
        scope.userName = 'Armando Castre';
      }

    }
  }
});
