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

  AccountHistoryController.$inject = ['accountService', '$http', '$rootScope', '$mdDialog', 'localStorageService'];

  function AccountHistoryController(accountService, $http, $rootScope, $mdDialog, localStorageService) {
        var ctrl = this;

        ctrl.user = localStorageService.get("user");

        ctrl.transactions = localStorageService.get("user").transactions;

        ctrl.processTransactions = function() {

            var finalTranses = [];

            function groupBy( array , f )
            {
              var groups = {};
              array.forEach( function( o )
              {
                var group = JSON.stringify( f(o) );
                groups[group] = groups[group] || [];
                groups[group].push( o );
              });
              return Object.keys(groups).map( function( group )
              {
                return groups[group];
              })
            }

            var result = groupBy(ctrl.transactions, function(item)
            {
              return [item.date];
            });

            result.forEach(function(item) {
                    var finalTrans = {};
                    if (item.length == 2) {
                        finalTrans.outcomingAmount = item[0].amount;
                        finalTrans.outcomingCurrency = item[0].currencyType;
                        finalTrans.incomingAmount = item[1].amount;
                        finalTrans.incomingCurrency = item[1].currencyType;
                        finalTrans.marketID = item[0].marketID;
                        finalTrans.date = item[0].date;
                    }
                    else {
                        finalTrans.amount = item[0].amount;
                        finalTrans.currencyType = item[0].currencyType;
                        finalTrans.marketID = item[0].marketID;
                        finalTrans.date = item[0].date;
                    }
                    finalTranses.push(finalTrans);
            });

            return finalTranses;

        };

        ctrl.processedTransactions = ctrl.processTransactions();

  }

})();
