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

    vm.user = {};
    vm.id = "584ddccd768e44aa41d6cf8e";
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

    vm.getUser = function() {
      $http.get('/api/users/' + vm.id)
        .then(function(response){
            $state.go('account', {obj: response.data.nickname});
        })
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

      ctrl.user = $scope.user;
      ctrl.xui = { nickname : "xui", password : "xui", name : "xui", email : "xui@xui.xui" };

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
        $http.post('/api/users', ctrl.xui)
          .then(function() {
            ctrl.status = 'OK';
          });
      };
  }
})();
