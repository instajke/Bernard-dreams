(function() {
  'use strict';

  angular
    .module('app')
    .service('marketService', ['$q', '$http','$timeout', '$rootScope', marketService]);

    function marketService($q, $http, $timeout, $rootScope) {

      return {
        getMarkets : function() {
            var deferred = $q.defer();
            $http.get('/api/markets')
                .success(function(data, status) {
                    if (status === 200) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject(data);
                    }
                })
                .error (function (data) {
                    deferred.reject(data);
                });

                return deferred.promise;
        },
        getMarketsByDevId : function(devId) {
            var deferred = $q.defer();

            $http.get('/api/markets/' + devId)
                .success(function(data, status) {
                    if (status === 200) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject(data);
                    }
                })
                .error (function (data) {
                    deferred.reject(data);
                });

                return deferred.promise;
        },
        getShops : function() {
            var deferred = $q.defer();
            $http.get('/shops')
                /*.then(function(response) {
                     console.log(response);
                     currentUser = response.data;
                });*/
                .success(function(response, status) {
                    if (status !== 500) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                    }
                })
                .error (function (response) {
                    deferred.reject();
                });

                return deferred.promise;
        },
        getUser: function(nickname) {
            var deferred = $q.defer();

            $http.get('/api/user/' + nickname)
                /*.then(function(response) {
                     console.log(response);
                     currentUser = response.data;
                });*/
                .success(function(data, status) {
                    if (status === 200) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject();
                    }
                })
                .error (function (data) {
                    deferred.reject();
                });

                return deferred.promise;
        },
        postMarket: function(market) {

            var deferred = $q.defer();

            $http.post('/api/market', {market : market})
                .success(function() {
                    deferred.resolve();
                })
                .error(function () {
                    deferred.reject();
                });

            return deferred.promise;
        }
      };
    }
})();
