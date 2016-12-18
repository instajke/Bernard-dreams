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

    vm.login = function() {

      // call login from service
      accountService.login(vm.user.nickname, vm.user.password)
        // handle success
        .then(function () {
          vm.showAlert("Success!");
          $state.go('account', { nickname : vm.user.nickname });
        })
        // handle error
        .catch(function () {
          vm.showAlert("Invalid username and/or password");
        });
    };

    vm.facebookLogin = function() {

        // call login from service
        var deferred = $q.defer();

        $http.get('/api/facebook')
            // handle success
            .success(function (data, status) {
                if(status === 200 && data.status){
                    vm.showAlert(data);
                    deferred.resolve();
                } else {
                    vm.showAlert(data);
                    deferred.reject();
                }
            })
            // handle error
            .error(function (data) {
                vm.showAlert(data);
                deferred.reject();
            });

        // return promise object
        return deferred.promise;
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
