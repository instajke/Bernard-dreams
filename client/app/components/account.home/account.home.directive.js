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

      ctrl.user = accountService.getUser($rootScope.rootParam.nickname);

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
          accountService.updatePaypal(ctrl.currentUser)
            .then ( function (response) {
                ctrl.showAlert(response);
            });
          ctrl.showAlert("Paypal account has been updated.")
      };

      ctrl.confirm = function () {
          accountService.upgradeToDev(ctrl.currentUser)
          ctrl.showAlert("U r dev now");
          $state.go('account', $stateParams);
      };

      $rootScope.pageClass = "page-home";
  }

})();
