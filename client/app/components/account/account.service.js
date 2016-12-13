(function() {
  'use strict';

  angular
    .module('app')
    .service('accountService', ['$q', '$http','$timeout', '$rootScope', accountService]);

    function accountService($q, $http, $timeout, $rootScope) {

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
        },
        isLoggedIn: function() {
          if(user) {
            return true;
          } else {
            return false;
          }
        },
        getUserStatus: function() {
          return user;
        },
        login: function(username, password) {

          var deferred = $q.defer();

          $http.post('/api/login',
               {username: username, password: password})
               // handle success
               .success(function (data, status) {
                   if(status === 200 && data.status){
                       user = true;
                       deferred.resolve();
                   } else {
                       user = false;
                       deferred.reject();
                   }
               })
               // handle error
               .error(function (data) {
                   user = false;
                   deferred.reject();
               });

           // return promise object
           return deferred.promise;
       },
        logout: function() {

          // create a new instance of deferred
          var deferred = $q.defer();

          // send a get request to the server
          $http.get('/user/logout')
            // handle success
            .success(function (data) {
              user = false;
              deferred.resolve();
            })
            // handle error
            .error(function (data) {
              user = false;
              deferred.reject();
            });

          // return promise object
          return deferred.promise;

        },
        register: function(user) {
          var deferred = $q.defer();

          $http.post('/api/register', { user : user})
              .success(function (data, status) {
                  if(status === 200 && data.status){
                      deferred.resolve();
                  } else {
                      deferred.reject();
                  }
              })
              // handle error
              .error(function (data) {
                  deferred.reject();
              });

          // return promise object
          return deferred.promise;

        }
      };
    }
})();
