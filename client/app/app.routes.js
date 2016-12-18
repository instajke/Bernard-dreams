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
        nickname: null
      }
    })
    .state('account.home', {
      url: '/home',
      template: '<acchome></acchome>',
      params: {
        nickname: null
      }
    })
    .state('account.history', {
      url: '/history',
      template: '<history></history>',
      params: {
        nickname: null
      }
    })
    .state('account.buy', {
      url: '/buy',
      template: '<buy></buy>',
      params: {
        nickname: null
      }
    })
    .state('account.markets', {
        url: '/markets',
        template: '<markets></markets>',
        params: {
            nickname: null
        }
    })
    .state('account.shops', {
        url: '/shops',
        template: '<shops></shops>',
        params: {
            nickname: null
        }
    });

    $urlRouterProvider.otherwise('/');
  }
})();
