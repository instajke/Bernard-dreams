(function() {
  'use strict';

  angular
    .module('app')
    .service('gamerMarketService', ['$q', '$http','$timeout', '$rootScope', gamerMarketService]);

    function gamerMarketService($q, $http, $timeout, $rootScope) {

      return {
          createSellOffer : function(userID, price, amount, marketID, currencyType) {
              var deferred = $q.defer();

                $http.post('/api/transaction/offer/sell',
                    { userID : userID, price : price, amount : amount, marketID : marketID, currencyType : currencyType })
                        .success(function() {
                                console.log("create offer success");
                                deferred.resolve();
                        })
                        .error (function() {
                            console.log("create offer error");
                            deferred.reject();
                        });

                return deferred.promise;
          },
          createBuyOffer : function(userID, price, amount, marketID, currencyType) {
              var deferred = $q.defer();

                $http.post('/api/transaction/offer/buy',
                    { userID : userID, price : price, amount : amount, marketID : marketID, currencyType : currencyType })
                        .success(function() {
                                console.log("create offer success");
                                deferred.resolve();
                        })
                        .error (function() {
                            console.log("create offer error");
                            deferred.reject();
                        });

                return deferred.promise;
          }
      };
    }
})();
