(function() {
  'use strict';

  angular
    .module('app')
    .directive('sell', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.gamer.sell/account.gamer.sell.template.html',
        controller: GamerSellController,
        controllerAs: 'gamerSellCtrl',
        bindToController: true
      };
    });

  GamerSellController.$inject = ['accountService', 'marketService', 'gamerMarketService', '$http', '$scope', '$rootScope', '$mdDialog', '$mdToast', 'localStorageService'];

  function GamerSellController(accountService, marketService, gamerMarketService, $http, $scope, $rootScope, $mdDialog, $mdToast, localStorageService) {
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

              marketService.getBuyMarketSellsByMarketIds(userMarkets).then
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
          gamerMarketService.createSellOffer(localStorageService.get("user")._id, $scope.offerPrice, $scope.offerAmount, $scope.currentMarket.marketID, $scope.currentMarket.currencyTypeSell)
            .then( function() {
                $scope.initMarkets();
                ctrl.createOfferDialog.hide();
                $scope.showSimpleToast("offer created");
                console.log();
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
              controller: GamerSellController
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
