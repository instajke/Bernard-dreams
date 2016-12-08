(function() {
  'use strict';

  angular
    .module('app')
    .service('accountService', ['$q', '$http', '$rootScope', accountService]);

    function accountService($q, $http, $rootScope) {
/*
      return {
        getTransactions: function () {
          var deferred = $q.defer(),
          httpPromise = $http.get('/api/things');

          httpPromise.then(function (response) {
            deferred.resolve(response);
          }, function (error) {
            return;
          });

          return deferred.promise;
        }
      };
      */
      return {
        getTransactions : function() {
        $http.get('/api/things')
          .then(function(response) {
            $rootScope.transactions = response.data;
          });
        },
        getShops : function() {
          $http.get('/shops')
            .then(function(response) {
              $rootScope.shops = response.data;
            });
        }
      };
    }
})();
