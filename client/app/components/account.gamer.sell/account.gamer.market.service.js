(function() {
  'use strict';

  angular
    .module('app')
    .service('gamerMarketService', ['$q', '$http','$timeout', '$rootScope', gamerMarketService]);

    function gamerMarketService($q, $http, $timeout, $rootScope) {

      return {
          createSellOffer : function(userID, price, amount, marketID, currencyType) {
              var deferred = $q.defer();

                $http.post('/transaction/offer/sell/',
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
          createBuyOffer : function(market, userID, price, amount) {
              var deferred = $q.defer();

                $http.post('/api/marketBuy/' + userID,
                    { marketBuy : market, price : price, amount : amount })
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
