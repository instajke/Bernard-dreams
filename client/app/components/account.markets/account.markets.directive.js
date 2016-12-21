(function() {
  'use strict';

  angular
    .module('app')
    .directive('markets', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.markets/account.markets.template.html',
        controller: MarketsController,
        controllerAs: 'marketsCtrl',
        bindToController: true
      };
    });

  MarketsController.$inject = ['marketService','$http', '$rootScope', '$mdDialog', '$stateParams'];

  function MarketsController(marketService, $http, $rootScope, $mdDialog, $stateParams) {
      var ctrl = this;

      ctrl.markets = {};
      ctrl.marketBuys = {};
      ctrl.marketSells = {};
      ctrl.currentMarket = {};
      ctrl.mgmtMarket = $mdDialog;
      ctrl.currencies = [{name: "Gold"}, {name: "Gems"}, {name: "Bucks"}, {name: "Whatever"}];

      ctrl.showCurrentMarket = function() {
          console.log(ctrl.currentMarket);
          $rootScope.showAlert(ctrl.currentMarket);
      };

      ctrl.showManageMarketDialog = function(ev, currentMarket) {
          ctrl.mgmtMarket.show({
              controller: manageMarketCtrl,
              templateUrl: 'app/components/controls/ManageMarket.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              locals: {
                  currentMarket : currentMarket
              },
              clickOutsideToClose: true
          });
      };

      ctrl.showManageMarketBuyDialog = function(ev, currentMarket) {
          ctrl.mgmtMarket.show({
              controller: manageMarketBuyCtrl,
              templateUrl: 'app/components/controls/ManageMarketBuy.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              locals: {
                  currentMarket : currentMarket
              },
              clickOutsideToClose: true
          });
      };

      ctrl.showManageMarketSellDialog = function(ev, currentMarket) {
          ctrl.mgmtMarket.show({
              controller: manageMarketSellCtrl,
              templateUrl: 'app/components/controls/ManageMarketSell.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              locals: {
                  currentMarket : currentMarket
              },
              clickOutsideToClose: true
          });
      };

      ctrl.postMarket = function() {
          ctrl.currentMarket.devID = $rootScope.rootParam.nickname;
          console.log(ctrl.currentMarket);
          marketService.postMarket(ctrl.currentMarket)
            .then (function () {
                ctrl.initMarkets();
                ctrl.initBuyMarkets();
                ctrl.initSellMarkets();
            })
      };

      ctrl.initMarkets = function() {
          marketService.getMarketsByDevId($rootScope.rootParam.nickname)
            .then( function (promise) {
                console.log("PROMISE");
                console.log(promise);
                ctrl.markets = promise.markets;
            })
      };

      ctrl.initBuyMarkets = function() {
          marketService.getBuyMarketsByDevId($rootScope.rootParam.nickname)
            .then( function ( promise ) {
                ctrl.marketBuys = promise.marketBuys;
            })
      };

      ctrl.initSellMarkets = function() {
          marketService.getSellMarketsByDevId($rootScope.rootParam.nickname)
            .then( function ( promise ) {
                console.log("SELL MARKETS PROMISE");
                console.log(promise);
                ctrl.marketSells = promise.marketSells;
                console.log("MARKET SELLS");
                console.log(ctrl.marketSells);
            })
      };

      ctrl.initMarkets();
      ctrl.initSellMarkets();
      ctrl.initBuyMarkets();
  }

  manageMarketCtrl.$inject = ['$http', '$scope', '$mdDialog', 'currentMarket'];

  function manageMarketCtrl($http, $scope, $mdDialog, currentMarket) {
      var ctrl = this;

      $scope.currentMarket = currentMarket;

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

      $scope.updateMarket = function() {
          console.log("we are in update market method");
          $http.put('/api/market', {market : $scope.currentMarket})
            .then(function (response) {

            });
            ctrl.hide();
      }
  }

  manageMarketBuyCtrl.$inject = ['$http', '$scope', '$mdDialog', 'currentMarket'];

  function manageMarketBuyCtrl($http, $scope, $mdDialog, currentMarket) {
      var ctrl = this;

      $scope.currentMarket = currentMarket;

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

      $scope.updateMarket = function() {
          $http.put('/api/marketBuy', {market : $scope.currentMarket})
            .then(function (response) {

            });
            ctrl.hide();
      }
  }

  manageMarketSellCtrl.$inject = ['$http', '$scope', '$mdDialog', 'currentMarket'];

  function manageMarketSellCtrl($http, $scope, $mdDialog, currentMarket) {
      var ctrl = this;

      $scope.currentMarket = currentMarket;

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

      $scope.updateMarket = function() {
          $http.put('/api/marketSell', {market : $scope.currentMarket})
            .then(function (response) {

            });
            ctrl.hide();
      }
  }

})();
