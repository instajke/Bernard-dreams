(function() {
  'use strict';

  angular
    .module('app')
    .config(routes);

  routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routes($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      url: '/',
      template: '<main></main>'
    })
    .state('account', {
      url: '/account',
      template: '<account></account>',
      params: {
        obj: null
      }
    })
    .state('account.home', {
      url: '/home',
      template: '<acchome></acchome>',
      params: {
        obj: null
      }
    })
    .state('account.history', {
      url: '/history',
      template: '<history></history>',
      params: {
        obj: null
      }
    })
    .state('account.buy', {
      url: '/buy',
      template: '<buy></buy>'
    });

    $urlRouterProvider.otherwise('/');
  }
})();
