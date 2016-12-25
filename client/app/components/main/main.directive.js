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

  MainCtrl.$inject = ['accountService', '$http', '$scope', '$rootScope', '$mdDialog', '$state', '$q', '$timeout'];

  function MainCtrl(accountService, $http, $scope, $rootScope, $mdDialog, $state, $q, $timeout) {

    var vm = this;
    var alert;

    vm.user = {};
    vm.isOpen             = false;
    vm.selectedDirection  = "down";
    vm.selectedMode       = "md-fling md-fab-top-right";
    vm.status = '';
    vm.$mdDialog          = $mdDialog;

    //FAB Log In
    vm.fabHidden = false;
    vm.fabOpen = false;
    vm.hover = false;
    vm.facebookTooltip = false;
    vm.twitterTooltip = false;
    vm.googleTooltip = false;
    vm.loginTooltip = false;

    $scope.$watch('mainVm.fabOpen', function(isOpen) {
        if (isOpen) {
            $timeout(function() {
                $scope.tooltipVisible = vm.fabOpen;
            }, 600);
        } else {
            $scope.tooltipVisible = vm.fabOpen;
        }
    })



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

    vm.loginSocial = function() {

        var deferred = $q.defer();

        $http.get('api/getAuthUser')
            .success(function(user){
                if (user !== '0') {
                    deferred.resolve();
                    vm.showAlert("Success!");
                    $state.go('account', {nickname : user.nickname})
                }
                else {
                    deferred.reject();

                }
            });
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
          $state.go('account', {nickname : ctrl.user.nickname})
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
