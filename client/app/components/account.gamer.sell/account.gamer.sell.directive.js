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

  GamerSellController.$inject = ['accountService', 'marketService', 'gamerMarketService', '$http', '$scope', '$rootScope', '$mdDialog', '$mdToast', 'localStorageService', '$filter','ChartJs'];

  function GamerSellController(accountService, marketService, gamerMarketService, $http, $scope, $rootScope, $mdDialog, $mdToast, localStorageService, $filter) {
      var ctrl = this;

      $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72']

      ctrl.user = localStorageService.get("user");
      ctrl.createOfferDialog = $mdDialog;
      ctrl.sellDialog = $mdDialog;
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
                accountService.checkLoggedIn();
                ctrl.createOfferDialog.hide();
                $scope.showSimpleToast("offer created");
                console.log();
            })

      };

      $scope.sellStuff = function() {

          if ($scope.offerAmount <= 0){
              $scope.showSimpleToast("Amount should be a positive number!");
              return;
          }

          $scope.offerPrice = $scope.currentMarket.marketType == 'Simulated Market' ? $scope.currentMarket.bestPrice : $scope.offerPrice;
          console.log("trans price");
          console.log($scope.offerPrice);

          gamerMarketService.buyStuff(localStorageService.get("user")._id, $scope.offerPrice, $scope.offerAmount, $scope.currentMarket.marketID, $scope.currentMarket.currencyTypeBuy)
              .then( function(promise) {
                  if (promise == "not good") {
                      $scope.showSimpleToast("Invalid amount. You don't have enough money. Please check and try again");
                  }
                  else {
                      if(promise.result == "Failed")
                          $scope.showSimpleToast("Wrong price! Best price now: " + promise.PriceIsChanged);
                      else
                          $scope.showSimpleToast("buy succeseded");
                  }
                  accountService.checkLoggedIn();
                  $scope.initMarkets();
                  ctrl.sellDialog.hide();
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
              , parent: angular.element(document.getElementById("theme-div"))
              , targetEvent: ev
              , scope: $scope
              , preserveScope: true
              , clickOutsideToClose: true
          });
      };

      ctrl.showSellDialog = function (market, ev) {
          $scope.currentMarket = market;

          ctrl.sellDialog.show({
              controller: GamerSellController
              , templateUrl: 'app/components/controls/Sell.html'
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

          $scope.currentMarket.graphicSell.forEach(function(item) {
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
              controller: GamerSellController
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
