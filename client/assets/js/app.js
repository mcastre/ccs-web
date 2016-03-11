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
    $urlProvider.otherwise('/login');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl as login',
      // resolve: {
      //   "currentAuth": ["Auth", function(Auth) {
      //     return Auth.$requireAuth();
      //   }]
      // },
      animation: {
        enter: 'fadeIn, fadeOut',
        leave: 'fadeOut, fadeIn'
      }
    });

    $stateProvider.state('project', {
      url: '/project/:id',
      templateUrl: 'templates/project.html',
      controller: 'ProjectViewCtrl as project',
      // resolve: {
      //   "currentAuth": ["Auth", function(Auth) {
      //     return Auth.$waitForAuth();
      //   }]
      // },
      animation: {
        enter: 'fadeIn, slideInUp',
        leave: 'fadeOut, slideOutBottom'
      }
    });
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
