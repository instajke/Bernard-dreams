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
      accountService.getUser($rootScope.rootParam.nickname)
          .then( function(promise) {
              console.log(promise);
              ctrl.newUser = promise;
          }) ;

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

      ctrl.updateUserAccount = function () {
          console.log(ctrl.newUser);
          accountService.postUser(ctrl.newUser);
      };

      ctrl.postMarket = function() {
          ctrl.currentMarket.devID = $rootScope.rootParam.nickname;
          console.log(ctrl.currentMarket);
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
