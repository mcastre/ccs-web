var app = angular.module('application');
app.directive('estimatesTable', ['RoomsSvc', function(RoomsSvc) {
  return {
    restrict: 'E',
    scope: {
      rows: '=',
      columns: '=',
      selectedElements: '=',
      tableTitle: '='
    },
    templateUrl: 'templates/estimates-table.html',
    link: function(scope, elem, attrs) {
      RoomsSvc.buildRooms(scope.rows, scope.columns);
      scope.roomToggle = false;
      scope.addRoomToggle = function() {
        scope.roomToggle = !scope.roomToggle;
      };
      scope.addRoom = function(room) {
        scope.rows.push({ 'name': room.name, 'id': scope.rows.length});
        RoomsSvc.buildRooms(scope.rows, scope.columns);
      };
    }
  }
}]);
