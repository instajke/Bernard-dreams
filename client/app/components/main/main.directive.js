(function() {
  'use strict';

  angular
    .module('app')
    .directive('main', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/main/main.html',
        controller: MainCtrl,
        controllerAs: 'mainVm',
        bindToController: true
      };
    });

  MainCtrl.$inject = ['accountService', '$http', '$scope', '$rootScope', '$mdDialog', '$state', '$q'];

  function MainCtrl(accountService, $http, $scope, $rootScope, $mdDialog, $state, $q) {

    var vm = this;
    var alert;

    vm.user = {};
    vm.isOpen             = false;
    vm.selectedDirection  = "down";
    vm.selectedMode       = "md-fling";
    vm.status = '';
    vm.$mdDialog          = $mdDialog;

    vm.showAlert = function(res) {
        alert = $mdDialog.alert({
            title: 'Attention',
            textContent: res,
            ok: 'Close'
        });

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
            });
    };

    vm.getUser = function() {
        $http.post('/api/login',
            {username: vm.user.nickname, password: vm.user.password})
            // handle success
            .success(function (data, status) {
                vm.showAlert(data);
                if(status === 200 && data.status){
                    vm.user = true;
                    vm.showAlert(data);
                    deferred.resolve();
                } else {
                    vm.user = false;
                    vm.showAlert(data);
                    deferred.reject();
                }
            })
            // handle error
            .error(function (data) {
                vm.user = false;
                vm.showAlert(data);
                deferred.reject();
            });

        // return promise object
        return deferred.promise;
    };

    vm.login = function () {

      // call login from service
      accountService.login(vm.user.nickname, vm.user.password)
        // handle success
        .then(function () {
          vm.showAlert("Success!");
          //$state.go('account', {obj : vm.user});
        })
        // handle error
        .catch(function () {
          vm.showAlert("Invalid username and/or password");
        });
    };

    vm.showRegistrationDialog = function(ev) {
        vm.$mdDialog.show({
            controller: UserRegistrationController
            , controllerAs: 'userRegCtrl'
            , templateUrl: 'app/components/controls/RegistrationSheet.html'
            , parent: angular.element(document.body)
            , targetEvent: ev
            , clickOutsideToClose: true
        });
    };
  }

  UserRegistrationController.$inject = ['accountService', '$http', '$scope', '$rootScope', '$mdDialog', '$state', '$q']

  function UserRegistrationController(accountService, $http, $scope, $rootScope, $mdDialog, $state, $q) {

      var deferred = $q.defer();
      var alert;
      var ctrl = this;

      ctrl.showConfirmPass = false;

      ctrl.user = {};

      ctrl.hide = function () {
          $mdDialog.hide();
      };

      ctrl.cancel = function () {
          $mdDialog.cancel();
      };

      ctrl.answer = function (answer) {
          $mdDialog.hide(answer);
      };

      ctrl.showConfirmPasswordInput = function() {
          $scope.showConfirmPass = true;
      };

      ctrl.showAlert = function(res) {
          alert = $mdDialog.alert({
              title: 'Attention',
              textContent: res,
              ok: 'Close'
          });

          $mdDialog
              .show( alert )
              .finally(function() {
                  alert = undefined;
              });
      };

      ctrl.postUser = function() {

        $http.post('/api/register', { user : ctrl.user})
            .success(function (data, status) {
                if(status === 200 && data.status){
                    ctrl.showAlert(data);
                    deferred.resolve();
                } else {
                    ctrl.showAlert(data);
                    deferred.reject();
                }
            })
            // handle error
            .error(function (data) {
                ctrl.showAlert(data);
                deferred.reject();
            });
      };

      ctrl.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      accountService.register(ctrl.user)
        // handle success
        .then(function () {
          ctrl.showAlert("Registration successful!")
          ctrl.hide();
          $state.go('account', {obj : ctrl.user})
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };
  }
})();
