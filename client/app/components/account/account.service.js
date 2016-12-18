(function() {
  'use strict';

  angular
    .module('app')
    .service('accountService', ['$q', '$http','$timeout', '$rootScope', accountService]);

    function accountService($q, $http, $timeout, $rootScope) {
      var user = null;
      var currentUser = null;

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
          $http.get('/api/logout')
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
        updatePaypal: function(user) {
          var deferred = $q.defer();

          $http.put('/api/paypal', {user : user})
            .success(function (data, status) {
              if (status === 200 && data.status) {
                deferred.resolve();
              }
              else {
                deferred.reject();
              }
            })
            .error(function (data) {
              deferred.reject();
            });

            return deferred.promise;
        },
        upgradeToDev: function(user) {
          var deferred = $q.defer();

          $http.put('/api/isDev', {user : user})
            .success(function (data, status) {
              if (status === 200 && data.status) {
                deferred.resolve();
              }
              else {
                deferred.reject();
              }
            })
            .error(function (data) {
              deferred.reject();
            });

            return deferred.promise;
        }
      };
    }
})();
