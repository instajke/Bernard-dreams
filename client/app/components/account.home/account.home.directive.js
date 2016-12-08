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

  AccountHomeController.$inject = ['accountService','$http', '$rootScope', '$mdDialog'];

  function AccountHomeController(accountService, $http, $rootScope, $mdDialog) {
      var ctrl = this;

      $rootScope.pageClass = "page-home";

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
      };*/

      //ctrl.getTransactions();
  }

})();
