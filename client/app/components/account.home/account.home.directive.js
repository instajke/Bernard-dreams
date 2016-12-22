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
      
      ctrl.user = {};

      accountService.getUser($rootScope.rootParam.nickname)
        .then(function(promise) {
            ctrl.user = promise;
        });
              
      accountService.getUser($rootScope.rootParam.nickname)
          .then( function(promise) {
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

      ctrl.updateUserAccount = function () {

          accountService.postUser(ctrl.newUser);
      };

      ctrl.postMarket = function() {
          ctrl.currentMarket.devID = $rootScope.rootParam.nickname;
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
