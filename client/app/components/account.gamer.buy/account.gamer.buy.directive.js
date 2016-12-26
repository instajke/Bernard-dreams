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

  GamerBuyController.$inject = ['accountService', 'marketService', 'gamerMarketService', '$http', '$scope', '$rootScope', '$mdDialog', 'localStorageService'];

  function GamerBuyController(accountService, marketService, gamerMarketService, $http, $scope, $rootScope, $mdDialog, localStorageService) {
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
          console.log("excluding buy markets - done");

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
                  console.log("initializing buy markets");
                  console.log(promise);
                  $scope.markets = promise.markets;
                  //$scope.showMarkets();
                  console.log("so we have following buy markets: ")
                  console.log($scope.markets);
                  //console.log($scope.availableMarkets);
              })
      };

      $scope.showSimpleToast = function(msg) {

        $mdToast.show(
          $mdToast.simple()
            .textContent(msg)
            .hideDelay(2000)
        );
      };

      $scope.createOffer = function() {
          console.log("Current buy market");
          console.log($scope.currentMarket);
          gamerMarketService.createBuyOffer($scope.currentMarket, localStorageService.get("user")._id, $scope.offerPrice, $scope.offerAmount)
            .then( function(promise) {
                $scope.initMarkets();
                ctrl.createOfferDialog.hide();
                $scope.showSimpleToast("offer created");
                console.log(promise);
            });
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
