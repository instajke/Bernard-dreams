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
      ctrl.currentUser = $rootScope.rootParam;

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



      ctrl.updatePaypalAccount = function () {
          accountService.updatePaypal(ctrl.currentUser);
          ctrl.showAlert("Paypal account has been updated.")
      };

      ctrl.confirm = function () {
          accountService.upgradeToDev(ctrl.currentUser)
          ctrl.showAlert("U r dev now");
      };

      $rootScope.pageClass = "page-home";
  }

})();
