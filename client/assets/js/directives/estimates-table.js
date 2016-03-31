var app = angular.module('application');
app.directive('estimatesTable', ['RoomsSvc', '$firebaseArray', function(RoomsSvc, $firebaseArray) {
  return {
    restrict: 'E',
    scope: {
      rows: '=',
      columns: '=',
      selectedElements: '=',
      tableTitle: '=',
      accordionData: '='
    },
    templateUrl: 'templates/estimates-table.html',
    link: function(scope, elem, attrs) {
      var roomsRef = new Firebase('https://ccs-web.firebaseio.com/Rooms');
      var rooms = $firebaseArray(roomsRef);
      
      console.log(scope.accordionData);

      scope.saveEstimate = function(val) {
        scope.accordionData.$save(val).then(function() {
          console.log('saved estimate', scope.accordionData);
        });
      };

      RoomsSvc.buildRooms(scope.rows, scope.columns);
      scope.roomToggle = false;
      scope.addRoomToggle = function() {
        scope.roomToggle = !scope.roomToggle;
      };
      scope.addRoom = function(room) {
        rooms.$add({
          'id': scope.rows.length,
          'name': room.name,
          'isSelected': false
        }).then(function(ref) {
          var roomId = ref.key();
        });
        RoomsSvc.buildRooms(scope.rows, scope.columns);
      };
    }
  }
}]);
