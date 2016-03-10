(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'firebase',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];

  function config($urlProvider, $locationProvider, $stateProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $stateProvider.state('project', {
      url: '/project/:id',
      templateUrl: 'templates/project.html',
      controller: 'ProjectViewCtrl as project',
      animation: {
        enter: 'fadeIn, slideInUp',
        leave: 'fadeOut, slideOutBottom'
      }
    })
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
