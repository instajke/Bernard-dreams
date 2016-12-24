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

  AccountHomeController.$inject = ['accountService','$http', '$rootScope', '$mdDialog', '$state', 'localStorageService'];

  function AccountHomeController(accountService, $http, $rootScope, $mdDialog, $state, localStorageService) {
      var ctrl = this;

      ctrl.newUser = localStorageService.get("user");

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
          ctrl.showAlert("U r dev now");
          $state.go('account', $stateParams);
      };

      $rootScope.pageClass = "page-home";

  }

})();
