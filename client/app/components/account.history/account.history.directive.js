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

      /*

      $rootScope.transactions = [];
      $rootScope.currentTrans = {};
      $rootScope.transDialog = $mdDialog;

      ctrl.getTransactions = function() {
        $http.get('/api/things')
          .then(function(response) {
            $rootScope.transactions = response.data;
          });
      };

      $rootScope.showTransDialog = function(ev, trans) {
          $rootScope.currentTrans = trans;
          $rootScope.transDialog.show({
              controller: TransDialogController,
              templateUrl: 'app/components/controls/DetailedItemInfo.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: true
          });
      };

      ctrl.getTransactions();*/
  }

})();
