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

  MarketsController.$inject = ['marketService','$http', '$rootScope', '$mdDialog', '$stateParams', 'localStorageService'];

  function MarketsController(marketService, $http, $rootScope, $mdDialog, $stateParams, localStorageService) {
      var ctrl = this;

      ctrl.markets = {};
      ctrl.marketBuys = {};
      ctrl.marketSells = {};
      ctrl.currentMarket = {};
      ctrl.mgmtMarket = $mdDialog;
      ctrl.currencies = [{name: "Gold"}, {name: "Gems"}, {name: "Bucks"}, {name: "Whatever"}];
      ctrl.marketTypes = [{name: "Real Market"}, {name: "Simulated Market"}];

      ctrl.showManageMarketDialog = function(ev, currentMarket) {
          ctrl.mgmtMarket.show({
              controller: manageMarketCtrl,
              templateUrl: 'app/components/controls/ManageMarket.html',
              parent: angular.element(document.getElementById("theme-div")),
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
              parent: angular.element(document.getElementById("theme-div")),
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
              parent: angular.element(document.getElementById("theme-div")),
              targetEvent: ev,
              locals: {
                  currentMarket : currentMarket
              },
              clickOutsideToClose: true
          });
      };

      ctrl.postMarket = function() {
          ctrl.currentMarket.devID = localStorageService.get("user")._id;
          marketService.postMarket(ctrl.currentMarket)
            .then (function () {
                ctrl.initMarkets();
                ctrl.initBuyMarkets();
                ctrl.initSellMarkets();
            })
      };

      ctrl.initMarkets = function() {
          marketService.getMarketsByDevId(localStorageService.get("user")._id)
            .then( function (promise) {
                ctrl.markets = promise.markets;
            })
      };

      ctrl.initBuyMarkets = function() {
          marketService.getBuyMarketsByDevId(localStorageService.get("user")._id)
            .then( function ( promise ) {
                ctrl.marketBuys = promise.marketBuys;
            })
      };

      ctrl.initSellMarkets = function() {
          marketService.getSellMarketsByDevId(localStorageService.get("user")._id)
            .then( function ( promise ) {

                ctrl.marketSells = promise.marketSells;

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
