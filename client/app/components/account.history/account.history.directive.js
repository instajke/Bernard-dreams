(function() {
  'use strict';

  angular
    .module('app')
    .directive('history', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.history/account.history.template.html',
        controller: AccountHistoryController,
        controllerAs: 'accHistCtrl',
        bindToController: true
      };
    });

  AccountHistoryController.$inject = ['accountService', 'historyService', '$http', '$rootScope', '$mdDialog', 'localStorageService'];

  function AccountHistoryController(accountService, historyService, $http, $rootScope, $mdDialog, localStorageService) {
        var ctrl = this;

        accountService.checkLoggedIn();

        ctrl.user = localStorageService.get("user");

        ctrl.transactions = localStorageService.get("user").transactions;

        console.log("we got transes");
        console.log(ctrl.transactions);

        ctrl.processedTransactions = historyService.processTransactions(ctrl.transactions);
        console.log("processed transes are");
        console.log(ctrl.processedTransactions)

  }

})();
