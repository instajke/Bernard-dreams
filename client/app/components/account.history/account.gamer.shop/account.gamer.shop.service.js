(function() {
  'use strict';

  angular
    .module('app')
    .service('gamerShopService', ['$q', '$http','$timeout', '$rootScope', gamerShopService]);

    function gamerShopService($q, $http, $timeout, $rootScope) {

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
        }
      };
    }
})();
