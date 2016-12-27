(function() {
  'use strict';

  angular
    .module('app')
    .service('shopService', ['$q', '$http','$timeout', '$rootScope', shopService]);

    function shopService($q, $http, $timeout, $rootScope) {

      return {
        getShops : function() {
            var deferred = $q.defer();
            $http.get('/api/shops')
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
        getShopsByDevId : function(devId) {
            var deferred = $q.defer();

            $http.get('/api/shops/' + devId)
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

        getMarkets : function(devId) {
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
        postShop: function(shop) {
            var deferred = $q.defer();

            $http.post('/api/shop', {shop : shop})
                .success(function() {
                    deferred.resolve();
                })
                .error(function () {
                    deferred.reject();
                });

            return deferred.promise;
        },
        addOffer : function(currShop, currOffer) {
            var deferred = $q.defer();

            $http.post('/api/shop/offer', {shop : currShop, offer : currOffer})
              .success(function() {
                  deferred.resolve();
              })
              .error(function() {
                  deferred.reject();
              });

            return deferred.promise;
        }
      };
    }
})();
