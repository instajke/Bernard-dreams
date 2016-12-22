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
    
    connectShopCtrl.$inject = ['accountService', '$http', '$rootScope', '$mdDialog', 'currentUser'];
    
    function connectShopCtrl(accountService, $http, $rootScope, $mdDialog, currentUser) {
        var ctrl = this;
        
        ctrl.currentMarket = {};
        
        ctrl.connect = function(market) {
            //TODO: init wallet, add to the account
            var wallet = { currencyType : market.currencyType1, amount : 0, marketID : market._id };
            currentUser 
        }
    }

})();
