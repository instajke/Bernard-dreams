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
          },
          buyStuff : function(userID, price, amount, marketID, currencyType) {
              var deferred = $q.defer();

              $http.post('/api/transaction/buy',
                  { userID : userID, price : price, amount : amount, marketID : marketID, currencyType : currencyType })
                  .success(function(data) {
                      console.log("buy success");
                      deferred.resolve(data);
                  })
                  .error (function(error) {
                      console.log("buy error");
                      deferred.resolve(error);
                  });
                  console.log(deferred.promise);
              return deferred.promise;
          },
          sellStuff : function(userID, price, amount, marketID, currencyType) {
              var deferred = $q.defer();

              $http.post('/api/transaction/sell',
                  { userID : userID, price : price, amount : amount, marketID : marketID, currencyType : currencyType })
                  .success(function(data) {
                      console.log("buy success");
                      deferred.resolve(data);
                  })
                  .error (function(error) {
                      console.log("buy error");
                      deferred.resolve(error);
                  });

              return deferred.promise;
          }
      };
    }
})();
