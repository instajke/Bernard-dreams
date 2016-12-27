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

  shopsController.$inject = ['shopService','$http', '$scope', '$rootScope', '$mdDialog', '$stateParams', 'localStorageService'];

  function shopsController(shopService, $http, $scope, $rootScope, $mdDialog, $stateParams, localStorageService) {
      var ctrl = this;

      ctrl.shops = {};
      ctrl.markets = {};

      ctrl.shopDialog = $mdDialog;
      ctrl.offerDialog = $mdDialog;
      ctrl.updateShopDlg = $mdDialog;

      ctrl.postShop = function() {
          var index = 0;
          ctrl.currentShop.devID = localStorageService.get("user")._id;
          for (var i = 0; i < ctrl.markets.length; ++i)
          {
                if (ctrl.markets[i]._id == ctrl.currentShop.marketID)
                {
                    index = i;
                    ctrl.markets[i].shopBinded = true;
                    ctrl.currentShop.internalCurrency = ctrl.markets[i].currencyType1;
                    ctrl.currentShop.externalCurrency = ctrl.markets[i].currencyType2;
                }
          }
          ctrl.updateMarket(ctrl.markets[index]);
          shopService.postShop(ctrl.currentShop)
            .then (function () {
                $scope.initShops();
            })
      };

      ctrl.updateMarket = function(market){
          $http.put('/api/market', { market : market })
            .then( function () {
                ctrl.initMarkets();
            })
      };

      $scope.initShops = function() {
          shopService.getShopsByDevId(localStorageService.get("user")._id)
            .then( function (promise) {
                console.log("shops reinited");
                console.log(promise);
                ctrl.shops = promise.shops;
            })
      };

      ctrl.initMarkets = function() {
          shopService.getMarkets(localStorageService.get("user")._id)
            .then( function(promise) {
                ctrl.markets = promise.markets;
            })
      };

       ctrl.showAddOfferDialog = function(ev, currentShop) {

          $scope.currentShop = currentShop;
          ctrl.shopDialog.show({
              scope: $scope,
              preserveScope: true,
              controller: addOfferController,
              templateUrl: 'app/components/controls/AddOffersToTheShop.html',
              parent: angular.element(document.getElementById("theme-div")),
              targetEvent: ev,
              locals: {
                  shop : currentShop
              },
              clickOutsideToClose: true
          });
      };

      ctrl.showUpdateOfferDialog = function(ev, currentShop, currentOffer) {

          $scope.currentShop = currentShop;
          $scope.currentOffer = currentOffer;
         ctrl.offerDialog.show({
             controller: updateOfferController,
             templateUrl: 'app/components/controls/UpdateOffer.html',
             parent: angular.element(document.getElementById("theme-div")),
             targetEvent: ev,
             locals: {
                 shop : currentShop,
                 offer : currentOffer
             },
             clickOutsideToClose: true
         });
     };

     ctrl.showUpdateShopDialog = function(ev, currentShop) {

         $scope.currentShop = currentShop;
        ctrl.updateShopDlg.show({
            controller: updateShopController,
            templateUrl: 'app/components/controls/UpdateShop.html',
            parent: angular.element(document.getElementById("theme-div")),
            targetEvent: ev,
            locals: {
                shop : currentShop
            },
            clickOutsideToClose: true
        });
    };

     ctrl.removeOffer = function(shop, offer) {
         console.log(ctrl.shops);
         var index = ctrl.shops.indexOf(shop);
         $http.delete('/api/shop/offer/' + shop._id + '/' + offer._id)
            .then( function (response) {
                $rootScope.showToast("Offer removed");
                $scope.initShops();
            });
     };

      ctrl.initMarkets();
      $scope.initShops();
  }

  updateShopController.$inject = ['$http', '$scope', '$mdDialog', 'shop'];

  function updateShopController($http, $scope, $mdDialog, shop) {
      var ctrl = this;

      $scope.currentShop = shop;

      ctrl.hide = function() {
          $mdDialog.hide();
      };
      ctrl.cancel = function() {
          $mdDialog.cancel();
      };
      ctrl.answer = function(answer) {
          $mdDialog.hide(answer);
      };

      $scope.updateShop = function() {
          console.log("we are about to update shop");
          console.log($scope.currentShop);
          $http.put('/api/shop', {shop : $scope.currentShop })
            .then( function(response) {

            });
            ctrl.hide();
      }
  }

  updateOfferController.$inject = ['$http', '$scope', '$mdDialog', 'shop', 'offer'];

  function updateOfferController($http, $scope, $mdDialog, shop, offer) {
      var ctrl = this;

      $scope.currentShop = shop;
      $scope.currentOffer = offer;

      ctrl.hide = function() {
          $mdDialog.hide();
      };
      ctrl.cancel = function() {
          $mdDialog.cancel();
      };
      ctrl.answer = function(answer) {
          $mdDialog.hide(answer);
      };

      $scope.updateOffer = function() {
          $http.put('/api/shop/offer', {shop : $scope.currentShop, offer : $scope.currentOffer})
            .then(function (response) {
                console.log("update offer response");
                console.log(response);
            });
            ctrl.hide();
      };

  }

  addOfferController.$inject = ['shopService','$http', '$scope', '$mdDialog', 'shop'];

  function addOfferController(shopService, $http, $scope, $mdDialog, shop) {
      var ctrl = this;

      $scope.currentShop = shop;
      $scope.currentOffer = {};

      ctrl.hide = function() {
          $mdDialog.hide();
      };
      ctrl.cancel = function() {
          $mdDialog.cancel();
      };
      ctrl.answer = function(answer) {
          $mdDialog.hide(answer);
      };

      $scope.addOffer = function() {
          shopService.addOffer($scope.currentShop, $scope.currentOffer)
            .then(function (promise) {
                $scope.initShops();
            });
            ctrl.hide();
      };
  }

})();
