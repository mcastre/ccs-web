(function() {
  'use strict';

  var app = angular.module('application');
  app.factory('RoomsSvc', function RoomsSvc() {

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
 var rows = [
    {
      "id": 0,
      "name": "Foyer",
      "isSelected": false
    },
    {
      "id": 1,
      "name": "Living",
      "isSelected": false
    },
    {
      "id": 2,
      "name": "Dining",
      "isSelected": false
    },
    {
      "id": 3,
      "name": "Hallway",
      "isSelected": false
    },
    {
      "id": 4,
      "name": "Bedroom",
      "isSelected": false
    },
    {
      "id": 5,
      "name": "Bathroom",
      "isSelected": false
    }
  ];
  var exteriorSides = [
    "Side 1",
    "Side 2",
    "Side 3",
    "Side 4",
    "Other"
  ];
  var exteriorSections = [
    {
      "id": 6,
      "name": "Siding",
      "isSelected": false
    },
    {
      "id": 7,
      "name": "Windows",
      "isSelected": false
    },
    {
      "id": 8,
      "name": "Trim",
      "isSelected": false
    },
    {
      "id": 9,
      "name": "Doors",
      "isSelected": false
    },
    {
      "id": 10,
      "name": "Other",
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
  });

})();
