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
                        console.log("STATUS 200");
                        console.log(data);
                        deferred.resolve(data);
                    }
                    else {
                        console.log("ELSE");
                        console.log(data);
                        deferred.reject(data);
                    }
                })
                .error (function (data) {
                    console.log("ERROR");
                    console.log(data);
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
                        console.log("STATUS 200");
                        console.log(response);
                        deferred.resolve();
                    }
                    else {
                        console.log("ELSE");
                        console.log(response);
                        deferred.reject();
                    }
                })
                .error (function (response) {
                    console.log("ERROR");
                    console.log(response);
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
                        console.log("STATUS 200");
                        console.log(data);
                        deferred.resolve(data);
                    }
                    else {
                        console.log("ELSE");
                        console.log(data);
                        deferred.reject();
                    }
                })
                .error (function (data) {
                    console.log("ERROR");
                    console.log(data);
                    deferred.reject();
                });

                return deferred.promise;
        },
        postMarket: function(market) {

            console.log('post market');
            console.log(market);
            $http.post('/api/market', {market : market});
        }
      };
    }
})();
