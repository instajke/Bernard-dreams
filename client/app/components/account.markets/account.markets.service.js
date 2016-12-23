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
        getMarket : function(marketId) {
            var deferred = $q.defer();
            $http.get('/api/market/' + marketId)
                .success(function(data, status) {
                    if (status === 200) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject(data);
                    }
                })
                .error(function(data) {
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
        getBuyMarketsByDevId : function(devId) {
            var deferred = $q.defer();

            $http.get('/api/marketBuy/' + devId)
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
        getBuyMarketsBuysByMarketIds : function (marketIdArray) {
                var deferred = $q.defer();

                $http.post('/api/marketBuys', marketIdArray)
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
        getBuyMarketSellsByMarketIds : function (marketIdArray) {
                var deferred = $q.defer();

                $http.post('/api/marketSells', marketIdArray)
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
        getSellMarketsByDevId : function(devId) {
            var deferred = $q.defer();

            $http.get('/api/marketSell/' + devId)
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
        getShopByMarketID : function(marketID) {
            var deferred = $q.defer();
            $http.get('/api/shop/' + marketID)
                .success(function(response, status) {
                if (status !== 500) {
                    deferred.resolve(response);
                }
                else {
                    console.log("Status 500");
                    console.log(response);
                    deferred.reject(response);
                }
            })
            .error (function (response) {
                console.log("ERROR")
                deferred.reject(response);
            });

            return deferred.promise;
        },
        getUser: function(nickname) {
            var deferred = $q.defer();

            $http.get('/api/user/' + nickname)
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
