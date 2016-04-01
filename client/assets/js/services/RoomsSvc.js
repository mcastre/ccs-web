(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('RoomsSvc', ['$firebaseArray', function RoomsSvc($firebaseArray) {

    var roomsRef = new Firebase('https://ccs-web.firebaseio.com/Rooms');
    var rows = $firebaseArray(roomsRef);

    function buildRooms(rows, cols) {
      angular.forEach(rows, function(row) {
        row.elements = [];
        angular.forEach(cols, function(col) {
          row.elements.push({name: col, isSelected: false});
        });
      });
    };
    var cols = [
     "Walls",
     "Ceiling",
     "Doors",
     "Crown",
     "Windows",
     "Cabinets",
     "Other"
   ];

    var exteriorSides = [
      "Doors (no)",
      "Windows (no)",
      "Shutters (no)",
      "Siding (ft)",
      "Brick (ft)",
      "Railing (ft)",
      "Deck (ft)",
      "Extra"
    ];
    var exteriorSections = [
      {
        "id": 6,
        "name": "Front",
        "isSelected": false
      },
      {
        "id": 7,
        "name": "Side 1",
        "isSelected": false
      },
      {
        "id": 8,
        "name": "Side 2",
        "isSelected": false
      },
      {
        "id": 9,
        "name": "Side 3",
        "isSelected": false
      },
      {
        "id": 10,
        "name": "Side 4",
        "isSelected": false
      },
      {
        "id": 11,
        "name": "Side",
        "isSelected": false
      },
      {
        "id": 12,
        "name": "Side",
        "isSelected": false
      }
   ];

    var getColumns = function() {
      return cols;
    };
    var getRows = function() {
      return rows;
    };
    var getExteriorSides = function() {
      return exteriorSides;
    };
    var getExteriorSections = function() {
      return exteriorSections;
    };
    return {
      getColumns: getColumns,
      getRows: getRows,
      getExteriorSides: getExteriorSides,
      getExteriorSections: getExteriorSections,
      buildRooms: buildRooms
    }
  }]);

})();
