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
      ctrl.shopDialog = $mdDialog;
      ctrl.offerDialog = $mdDialog;
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
      };

       ctrl.showAddOfferDialog = function(ev, currentShop) {
          ctrl.shopDialog.show({
              controller: addOfferToShopController,
              templateUrl: 'app/components/controls/AddOffersToTheShop.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              locals: {
                  currentShop : currentShop
              },
              clickOutsideToClose: true
          });
      };

      ctrl.showUpdateOfferDialog = function(ev, currentShop, currentOffer) {
         ctrl.offerDialog.show({
             controller: updateOfferCtrl,
             templateUrl: 'app/components/controls/UpdateOffer.html',
             parent: angular.element(document.body),
             targetEvent: ev,
             locals: {
                 currentShop : currentShop,
                 currentOffer : currentOffer
             },
             clickOutsideToClose: true
         });
     };

     ctrl.removeOffer = function(shop, offer) {
         var index = ctrl.shops.indexOf(shop);
         $http.delete('/api/shop/offer/' + shop._id + '/' + offer.ID)
            .then( function (response) {

                for (var j = offer.ID; j < ctrl.shops[index].offers.length; ++index) {
                    ctrl.shops[index].offers[j].ID--;
                }
                ctrl.shops[index].offers.splice(offer.ID - 1, 1);
                console.log(ctrl.shops[index]);
                $rootScope.showAlert("Offer removed");
                ctrl.initShops();
            });
     };


      ctrl.initMarkets();
      ctrl.initShops();
  }

  addOfferToShopController.$inject = ['$http', '$scope', '$mdDialog', 'currentShop'];

  function addOfferToShopController($http, $scope, $mdDialog, currentShop) {

      var ctrl = this;

      $scope.currentOffer = {};

      $scope.currentShop = currentShop;

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
          console.log("we are in add offer method");
          $scope.currentShop.offers.push($scope.currentOffer);
          $http.post('/api/shop/offer', {shop : $scope.currentShop})
            .then(function (response) {

            });
            ctrl.hide();
      };
  }

  updateOfferCtrl.$inject = ['$http', '$scope', '$mdDialog', 'currentShop', 'currentOffer'];

  function updateOfferCtrl($http, $scope, $mdDialog, currentShop, currentOffer) {
      var ctrl = this;

      $scope.currentOffer = currentOffer;

      $scope.currentShop = currentShop;

      $scope.currencies = [{name: "Gold"}, {name: "Gems"}, {name: "Bucks"}, {name: "Whatever"}];

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
          console.log("we are in update offer method");
          $http.put('/api/shop/offer', {shop : $scope.currentShop, offer : $scope.currentOffer})
            .then(function (response) {

            });
            ctrl.hide();
      }
  }

})();
