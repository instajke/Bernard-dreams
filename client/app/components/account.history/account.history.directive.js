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

  AccountHistoryController.$inject = ['accountService', '$http', '$rootScope', '$mdDialog', 'localStorageService'];

  function AccountHistoryController(accountService, $http, $rootScope, $mdDialog, localStorageService) {
      var ctrl = this;

      ctrl.user = localStorageService.get("user");

      //ctrl.user.transactions.forEach(function(item) {
      //var tmp = item;
      //    tmp.date.
      //})

      ctrl.transactions = ctrl.user.transactions;

  }

})();
