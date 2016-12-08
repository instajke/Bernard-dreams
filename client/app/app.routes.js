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
      template: '<account></account>'
    })
    .state('account.home', {
      url: '/home',
      template: '<acchome></acchome>'
    })
    .state('account.history', {
      url: '/history',
      template: '<history></history>'
    })
    .state('account.buy', {
      url: '/buy',
      template: '<buy></buy>'
    });

    $urlRouterProvider.otherwise('/');
  }
})();
