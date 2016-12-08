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

  MainCtrl.$inject = ['$http', '$rootScope', '$mdDialog'];

  function MainCtrl($http, $rootScope, $mdDialog) {
    var vm = this;

    vm.thing = {};
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

    vm.showRegistrationDialog = function(ev) {
        vm.$mdDialog.show({
            controller: UserRegistrationController
            , templateUrl: 'app/components/controls/RegistrationSheet.html'
            , parent: angular.element(document.body)
            , targetEvent: ev
            , clickOutsideToClose: true
        });
    };
  }

  UserRegistrationController.$inject = ['$http', '$scope', '$rootScope', '$mdDialog']

  function UserRegistrationController($http, $scope, $rootScope, $mdDialog) {
    
      $scope.hide = function () {
          $mdDialog.hide();
      };
      $scope.cancel = function () {
          $mdDialog.cancel();
      };
      $scope.answer = function (answer) {
          $mdDialog.hide(answer);
      };
      $rootScope.user = $scope.user;
  }
})();
