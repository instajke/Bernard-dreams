(function() {
  'use strict';

  angular
    .module('app')
    .directive('gamershops', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.gamer.shop/account.gamer.shop.template.html',
        controller: gamerShopController,
        controllerAs: 'shopCtrl',
        bindToController: true
      };
    });

  gamerShopController.$inject = ['gamerShopService', '$http', '$rootScope', '$mdDialog', '$stateParams'];

  function gamerShopController(gamerShopService, $http, $rootScope, $mdDialog, $stateParams) {
      var ctrl = this;

      ctrl.shops = {};
      ctrl.currentShop = {};

      ctrl.showCurrentShop = function() {
          console.log(ctrl.currentShop);
          $rootScope.showAlert(ctrl.currentShop);
      };

      ctrl.initShops = function() {
          console.log("init shops");
          gamerShopService.getShops()
            .then( function (promise) {
                console.log("PROMISE");
                console.log(promise);
                ctrl.shops = promise.shops;
            })
      };

      ctrl.showShopDialog = function(ev, shop) {

          console.log("selected shop: ");
          console.log(shop);

          $rootScope.historyDialog.show({
              controller: ShopDialogController,
              templateUrl: 'app/components/controls/Shop.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              locals : {
                    dialogShop : shop
                },
              clickOutsideToClose: true
          });
      };

      ctrl.initShops();

  }

  ShopDialogController.$inject = ['$scope', '$mdDialog', 'dialogShop'];

  function ShopDialogController($scope, $mdDialog, dialogShop) {
      var ctrl = this;

      $scope.dialogShop = dialogShop;

      $scope.hide = function() {
          $mdDialog.hide();
      }
      $scope.cancel = function() {
          $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
          $mdDialog.hide(answer);
      };

  }

})();
