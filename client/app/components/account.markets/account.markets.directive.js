(function() {
  'use strict';

  angular
    .module('app')
    .directive('markets', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.markets/account.markets.template.html',
        controller: MarketsController,
        controllerAs: 'marketsCtrl',
        bindToController: true
      };
    });

  MarketsController.$inject = ['marketService','$http', '$rootScope', '$mdDialog', '$stateParams'];

  function MarketsController(marketService, $http, $rootScope, $mdDialog, $stateParams) {
      var ctrl = this;

      ctrl.markets = {};
      ctrl.currentMarket = {};
      ctrl.currencies = [{name: "Gold"}, {name: "Gems"}, {name: "Bucks"}, {name: "Whatever"}];

      ctrl.showCurrentMarket = function() {
          console.log(ctrl.currentMarket);
          $rootScope.showAlert(ctrl.currentMarket);
      };

      ctrl.postMarket = function() {
          ctrl.currentMarket.devID = $rootScope.rootParam.nickname;
          console.log(ctrl.currentMarket);
          marketService.postMarket(ctrl.currentMarket)
            .then (function () {
                ctrl.initMarkets();
            })
      };

      ctrl.initMarkets = function() {
          marketService.getMarketsByDevId($rootScope.rootParam.nickname)
            .then( function (promise) {
                console.log("PROMISE");
                console.log(promise);
                ctrl.markets = promise.markets;
            })
      };

      ctrl.initMarkets();
  }

})();
