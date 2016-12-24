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
    })
    .state('account.history', {
      url: '/history',
      template: '<history></history>',
    })
    .state('account.buy', {
      url: '/buy',
      template: '<buy></buy>',
    })
    .state('account.sell', {
        url: '/sell',
        template: '<sell></sell>',
    })
    .state('account.markets', {
        url: '/markets',
        template: '<markets></markets>',
    })
    .state('account.shops', {
        url: '/shops',
        template: '<shops></shops>',
    })
    .state('account.gamerShops', {
        url: '/shop',
        template: '<gamershop></gamershop>',
    });

    $urlRouterProvider.otherwise('/');
  }
})();
