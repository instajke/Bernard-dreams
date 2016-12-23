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

  GamerSellController.$inject = ['accountService', 'marketService', '$http', '$scope', '$rootScope', '$mdDialog', 'localStorageService'];

  function GamerSellController(accountService, marketService, $http, $scope, $rootScope, $mdDialog, localStorageService) {
      var ctrl = this;

      ctrl.user = localStorageService.get("user");

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

      $scope.initMarkets();
  }

})();
