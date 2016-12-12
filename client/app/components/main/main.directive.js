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

  MainCtrl.$inject = ['$http', '$rootScope', '$mdDialog', '$state'];

  function MainCtrl($http, $rootScope, $mdDialog, $state) {
    var vm = this;
    var alert;

    vm.user = {};
    vm.id = "584e70e00ec505230753052e";
    vm.thing = { name : "thing", description : "description"};
    vm.isOpen             = false;
    vm.selectedDirection  = "down";
    vm.selectedMode       = "md-fling";
    vm.status = '';
    vm.$mdDialog          = $mdDialog;

    vm.getThings = function() {
      $http.get('/api/things')
        .then(function(response) {
          vm.thingsList = response.data;
        });
    };

    vm.postThing = function() {
      $http.post('/api/things', vm.thing)
        .then(function() {
          vm.status = 'OK';
        });
    };

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
    }

    vm.getUser = function() {
      $http.get('/api/users/' + vm.user.email + '/' + vm.user.password)
        .then(function(response){
          if (response.status !== 200)
            vm.showAlert(response);
          else
            $state.go('account', {obj: response.data});
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

  UserRegistrationController.$inject = ['$http', '$scope', '$rootScope', '$mdDialog', '$state']

  function UserRegistrationController($http, $scope, $rootScope, $mdDialog, $state) {

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
      }

      ctrl.postUser = function() {
        $http.post('/api/users', ctrl.user)
          .then(function() {
            ctrl.status = 'OK';
            ctrl.hide();
          });
      };
  }
})();
