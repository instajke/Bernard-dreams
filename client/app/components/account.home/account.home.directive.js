(function() {
  'use strict';

  angular
    .module('app')
    .directive('acchome', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.home/account.home.template.html',
        controller: AccountHomeController,
        controllerAs: 'accHomeCtrl',
        bindToController: true
      };
    });

  AccountHomeController.$inject = ['accountService', 'historyService','$http', '$scope','$rootScope', '$mdDialog', '$state', 'localStorageService'];

  function AccountHomeController(accountService, historyService, $http, $scope, $rootScope, $mdDialog, $state, localStorageService) {
      var ctrl = this;

      ctrl.newUser = localStorageService.get("user");

      var transes = historyService.processTransactions(ctrl.newUser.transactions);

      var wallets = historyService.groupBy(ctrl.newUser.wallet, function(item)
      {
        return [item.marketID];
      });

      ctrl.processedWallets = [];

      wallets.forEach(function(item) {
          var tmp = {};

          tmp.internalCurrency = item[0].currencyType;
          tmp.internalAmount = item[0].amount;
          tmp.externalCurrency = item[1].currencyType;
          tmp.externalAmount = item[1].amount;
          tmp.marketID = item[0].marketID;

          ctrl.processedWallets.push(tmp);
      })

      console.log("PROCESSED WALLETS");
      console.log(ctrl.processedWallets);

      ctrl.lastTrans = transes[transes.length - 1];

      ctrl.showAlert = function(res) {
            alert = $mdDialog.alert({
                title: 'Attention',
                textContent: res,
                ok: 'Close'
            });

            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
      };

      ctrl.updateUserAccount = function () {

          accountService.postUser(ctrl.newUser);
          localStorageService.set("user", ctrl.newUser);
      };

      ctrl.postMarket = function() {
          ctrl.currentMarket.devID = localStorageService.get("user").nickname;
          accHomeService.postMarket(ctrl.currentMarket)
              .then (function () {
                  ctrl.initMarkets();
              })
      };

      ctrl.confirm = function () {
          accountService.upgradeToDev(ctrl.user);
          $rootScope.showToast("U r dev now");
          $state.go('account', $stateParams);
      };

  }

})();
