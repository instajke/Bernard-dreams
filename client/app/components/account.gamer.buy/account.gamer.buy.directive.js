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

  GamerBuyController.$inject = ['accountService', 'marketService', 'gamerMarketService', '$http', '$scope', '$rootScope', '$mdDialog', '$mdToast', 'localStorageService', '$filter', 'ChartJs'];

  function GamerBuyController(accountService, marketService, gamerMarketService, $http, $scope, $rootScope, $mdDialog, $mdToast, localStorageService, $filter) {
      var ctrl = this;

      ctrl.user = localStorageService.get("user");
      ctrl.createOfferDialog = $mdDialog;
      ctrl.buyDialog = $mdDialog;
      ctrl.chartDialog = $mdDialog;

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
          console.log("we are creating buy offer");
          console.log(localStorageService.get("user")._id);
          console.log($scope.offerPrice);
          console.log($scope.offerAmount);
          console.log($scope.currentMarket.marketID);
          console.log($scope.currentMarket.currencyTypeBuy);
          gamerMarketService.createBuyOffer(localStorageService.get("user")._id, $scope.offerPrice, $scope.offerAmount, $scope.currentMarket.marketID, $scope.currentMarket.currencyTypeBuy)
            .then( function() {
                accountService.checkLoggedIn();
                $scope.initMarkets();
                ctrl.createOfferDialog.hide();
                $scope.showSimpleToast("offer created");
            })

      };

      $scope.buyStuff = function() {
          console.log("buy stuff");
          console.log(localStorageService.get("user")._id);
          console.log($scope.offerPrice);
          console.log($scope.offerAmount);
          console.log($scope.currentMarket.marketID);
          console.log($scope.currentMarket.currencyTypeBuy);
          if ($scope.offerAmount <= 0){
              $scope.showSimpleToast("Amount should be a positive number!");
              return;
          }
          gamerMarketService.sellStuff(localStorageService.get("user")._id, $scope.offerPrice, $scope.offerAmount, $scope.currentMarket.marketID, $scope.currentMarket.currencyTypeAnother)
              .then( function(promise) {
                  if (promise == "not good") {
                      $scope.showSimpleToast("Invalid amount. Please check and try again");
                  }
                  else {
                      $scope.showSimpleToast("buy succeseded");
                  }
                  accountService.checkLoggedIn();
                  $scope.initMarkets();
                  ctrl.buyDialog.hide();
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
              , parent: angular.element(document.getElementById("theme-div"))
              , targetEvent: ev
              , scope: $scope
              , preserveScope: true
              , clickOutsideToClose: true
          });
      };

      ctrl.showBuyDialog = function (market, ev) {
          $scope.currentMarket = market;

          ctrl.buyDialog.show({
              controller: GamerBuyController
              , templateUrl: 'app/components/controls/Buy.html'
              , parent: angular.element(document.getElementById("theme-div"))
              , targetEvent: ev
              , scope: $scope
              , preserveScope: true
              , clickOutsideToClose: true
          });
      };

      ctrl.showChartDialog = function (market, ev) {
          $scope.currentMarket = market;

          $scope.chartLabels = [];
          $scope.chartData = [];
          $scope.dataSample = [];

          $scope.currentMarket.graphicBuy.forEach(function(item) {
              var date = new Date(item.date);
              $scope.chartLabels.push($filter('date')(date, 'hh:mm:ss - dd.MM.yyyy'));
              $scope.dataSample.push(item.price);
          });

          $scope.chartData.push($scope.dataSample);

          $scope.datasetOverride = [{
              label: $scope.currentMarket.marketName,
              borderWidth: 3,
              hoverBackgroundColor: "rgba(255,99,132,0.4)",
              hoverBorderColor: "rgba(255,99,132,1)",
              type: 'line'
          }];

          console.log($scope.chartLabels);
          console.log($scope.chartData);

          ctrl.chartDialog.show({
              controller: GamerBuyController
              , templateUrl: 'app/components/controls/ShowChart.html'
              , parent: angular.element(document.getElementById("theme-div"))
              , targetEvent: ev
              , scope: $scope
              , preserveScope: true
              , clickOutsideToClose: true
          });
      };


      $scope.initMarkets();
  }

})();
