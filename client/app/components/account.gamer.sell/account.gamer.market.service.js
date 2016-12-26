(function() {
  'use strict';

  angular
    .module('app')
    .service('gamerMarketService', ['$q', '$http','$timeout', '$rootScope', gamerMarketService]);

    function gamerMarketService($q, $http, $timeout, $rootScope) {

      return {
          createSellOffer : function(market, userID, price, amount) {
              var deferred = $q.defer();

                $http.post('/api/marketSell/' + userID,
                    { marketSell : market, price : price, amount : amount })
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
