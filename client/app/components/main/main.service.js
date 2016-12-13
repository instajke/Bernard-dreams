(function() {
  'use strict';

  angular
    .module('app')
    .service('authService', ['$q', '$http', '$timeout', '$rootScope', authService]);

    function authService($q, $http, $timeout, $rootScope) {
          var user = null;

          // return available functions for use in the controllers
          return {
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
            login: function(nick, pass) {

              var deferred = $q.defer();

              $http.post('/api/login',
                   {username: nick, password: pass})
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
