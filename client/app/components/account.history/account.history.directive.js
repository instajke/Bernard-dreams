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

  AccountHistoryController.$inject = ['accountService', 'historyService', '$http', '$rootScope', '$mdDialog', 'localStorageService'];

  function AccountHistoryController(accountService, historyService, $http, $rootScope, $mdDialog, localStorageService) {
        var ctrl = this;

        ctrl.user = localStorageService.get("user");

        //ctrl.transactions = localStorageService.get("user").transactions;

        ctrl.transactions = [{
            "currencyType" : "Gems",
            "amount" : -1680,
            "marketID" : "58627e10cd41d9001d3d3ddf",
            "_id" : "586294ab9ec75e001dc3d3a9",
            "date" : "2016-12-27T16:19:55.070Z"
            },
            {
            "currencyType" : "Gold",
            "amount" : 400,
            "marketID" : "58627e10cd41d9001d3d3ddf",
            "_id" : "586294ab9ec75e001dc3d3aa",
            "date" : "2016-12-27T16:19:55.070Z"
            },
            {
            "currencyType" : "Gold",
            "amount" : 200,
            "marketID" : "58627e10cd41d9001d3d3ddf",
            "_id" : "586297e39ec75e001dc3d3ae",
            "date" : "2016-12-27T16:33:39.667Z"
            },
            {
            "currencyType" : "Gems",
            "amount" : -2100,
            "marketID" : "58627e10cd41d9001d3d3ddf",
            "_id" : "5862a1ab29dcd3001d479047",
            "date" : "2016-12-27T17:15:23.610Z"
            },
            {
            "currencyType" : "Gold",
            "amount" : 400,
            "marketID" : "58627e10cd41d9001d3d3ddf",
            "_id" : "5862a1ab29dcd3001d479048",
            "date" : "2016-12-27T17:15:23.614Z"
        }];

        ctrl.processedTransactions = historyService.processTransactions(ctrl.transactions);

  }

})();
