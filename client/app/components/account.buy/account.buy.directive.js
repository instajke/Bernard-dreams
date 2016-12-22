(function() {
  'use strict';

  angular
    .module('app')
    .directive('buy', function() {
      return {
        restrict: 'E',
        templateUrl: '/app/components/account.buy/account.buy.template.html',
        controller: AccountBuyController,
        controllerAs: 'buyCtrl',
        bindToController: true
      };
    });

  AccountBuyController.$inject = ['accountService', '$http', '$rootScope', '$mdDialog'];

  function AccountBuyController(accountService, $http, $rootScope, $mdDialog) {
      var ctrl = this;

      

  }

})();
