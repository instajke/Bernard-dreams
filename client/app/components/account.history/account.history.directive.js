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

        ctrl.user = localStorageService.get("user");

        ctrl.transactions = localStorageService.get("user").transactions;

        ctrl.processedTransactions = historyService.processTransactions(ctrl.transactions);

  }

})();
