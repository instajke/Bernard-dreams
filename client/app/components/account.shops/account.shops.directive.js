(function() {
  'use strict';

  angular
    .module('app')
    .directive('shops', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.shops/account.shops.template.html',
        controller: shopsController,
        controllerAs: 'shopsCtrl',
        bindToController: true
      };
    });

  shopsController.$inject = ['shopService','$http', '$rootScope', '$mdDialog', '$stateParams'];

  function shopsController(shopService, $http, $rootScope, $mdDialog, $stateParams) {
      var ctrl = this;

      ctrl.shops = {};
      ctrl.markets = {};
      ctrl.currentShop = {};
      ctrl.currencies = [{name: "Gold"}, {name: "Gems"}, {name: "Bucks"}, {name: "Whatever"}];

      ctrl.showCurrentShop = function() {
          console.log(ctrl.currentShop);
          $rootScope.showAlert(ctrl.currentShop);
      };

      ctrl.postShop = function() {
          ctrl.currentShop.devID = $rootScope.rootParam.nickname;
          console.log(ctrl.currentShop);
          shopService.postShop(ctrl.currentShop)
            .then (function () {
                ctrl.initShops();
            })

      };

      ctrl.initShops = function() {
          shopService.getShopsByDevId($rootScope.rootParam.nickname)
            .then( function (promise) {
                console.log("PROMISE");
                console.log(promise);
                ctrl.shops = promise.shops;
            })
      };

      ctrl.initMarkets = function() {
          shopService.getMarkets($rootScope.rootParam.nickname)
            .then( function(promise) {
                console.log("PROMISE");
                console.log(promise);
                ctrl.markets = promise.markets;
            })
      }

      ctrl.initMarkets();
      ctrl.initShops();
  }

})();
