(function() {
  'use strict';

  angular
    .module('app')
    .directive('buy', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.gamer.buy/account.gamer.buy.template.html',
        controller: GamerBuyController,
        controllerAs: 'gamerBuyCtrl',
        bindToController: true
      };
    });

  GamerBuyController.$inject = ['accountService', 'marketService', 'gamerMarketService', '$http', '$scope', '$rootScope', '$mdDialog', '$mdToast', 'localStorageService'];

  function GamerBuyController(accountService, marketService, gamerMarketService, $http, $scope, $rootScope, $mdDialog, $mdToast, localStorageService) {
      var ctrl = this;

      ctrl.user = localStorageService.get("user");
      ctrl.createOfferDialog = $mdDialog;

      $scope.offerPrice = 0;
      $scope.offerAmount = 0;

      $scope.showMarkets = function() {
          $scope.availableMarkets = $scope.markets;

          var indexes = [];
          for (var index = 0; index < $scope.availableMarkets.length; index++) {
              for (var jndex = 0; jndex < $scope.currentUser.wallet.length; jndex++) {

                  if ($scope.availableMarkets[index]._id === $scope.currentUser.wallet[jndex].marketID)
                      {
                          indexes.push(index);
                      }
              }
          }
          while (indexes.length > 0) {
              $scope.availableMarkets.splice(indexes[0], 1);
              indexes.splice(0, 1);
          }
          console.log("excluding markets - done");

      };

      $scope.initMarkets = function () {
          var userMarkets = [];
              $scope.currentUser = localStorageService.get("user");

              $scope.currentUser.wallet.forEach(function(item) {
                  userMarkets.push(item.marketID);
              })

              console.log("array of marketID");
              console.log(userMarkets);

              marketService.getBuyMarketsBuysByMarketIds(userMarkets).then
              (function (promise) {
                  console.log("initializing markets");
                  console.log(promise);
                  $scope.markets = promise.markets;
                  //$scope.showMarkets();
                  console.log("so we have following markets: ")
                  console.log($scope.markets);
                  //console.log($scope.availableMarkets);
              })
      };

      $scope.createOffer = function() {
          console.log("create buy offer params");
          console.log($scope.currentMarket);
          console.log(localStorageService.get("user")._id);
          console.log($scope.offerPrice);
          console.log($scope.offerAmount);
          gamerMarketService.createBuyOffer($scope.currentMarket, localStorageService.get("user")._id, $scope.offerPrice, $scope.offerAmount)
            .then( function() {
                $scope.initMarkets();
                ctrl.createOfferDialog.hide();
                $scope.showSimpleToast("offer created");
            })

      };

      $scope.showSimpleToast = function(msg) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(msg)
            .hideDelay(2000)
        );
      };

      ctrl.showCreateOfferDialog = function (market, ev) {
          $scope.currentMarket = market;

          ctrl.createOfferDialog.show({
              controller: GamerBuyController
              , templateUrl: 'app/components/controls/CreateOffer.html'
              , parent: angular.element(document.body)
              , targetEvent: ev
              , scope: $scope
              , preserveScope: true
              , clickOutsideToClose: true
          });
      };

      $scope.initMarkets();
  }

})();
