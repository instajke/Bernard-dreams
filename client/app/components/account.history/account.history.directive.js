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

  AccountHistoryController.$inject = ['accountService', '$http', '$rootScope', '$mdDialog'];

  function AccountHistoryController(accountService, $http, $rootScope, $mdDialog) {
      var ctrl = this;

      $rootScope.pageClass = "page-history";

  }

})();
