(function() {
    'use strict';

    angular
        .module('app')
        .directive('account', function() {
            return {
                restrict: 'E',
                templateUrl: '/app/components/account/account.html',
                controller: AccountPageController,
                controllerAs: 'accPageCtrl',
                bindToController: true
            };
        });

    AccountPageController.$inject = ['accountService', '$http', '$rootScope', '$mdDialog', '$state', '$mdSidenav', '$timeout', '$log', '$stateParams', 'localStorageService'];

    function AccountPageController(accountService, $http, $rootScope, $mdDialog, $state, $mdSidenav, $timeout, $log, $stateParams ,localStorageService) {

        var ctrl = this;

        $rootScope.rootParam = $stateParams;

        if (localStorageService.get("user") === '') {
            accountService.getUser($rootScope.rootParam.nickname)
                .then( function (promise) {
                    console.log("we are inside bullshit if");
                    console.log($rootScope.rootParam.nickname);
                    console.log(promise);
                    localStorageService.set("user", promise);
                    ctrl.user = localStorageService.get("user");
                })
        }
        ctrl.user = localStorageService.get("user");


        $rootScope.showAlert = function(text) {
            alert = $mdDialog.alert({
                title: 'Attention',
                textContent: text,
                ok: 'Close'
            });

            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        };

        $rootScope.historyDialog = $mdDialog;
        $rootScope.upgradeDialog = $mdDialog;
        $rootScope.shops = [];

        $rootScope.showHistoryDialog = function(ev, transactions) {
            $rootScope.transactions = transactions;
            $rootScope.historyDialog.show({
                controller: HistoryDialogController,
                templateUrl: 'app/components/controls/HistorySheet.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        $rootScope.showUpgradeDialog = function(ev) {
            $rootScope.upgradeDialog.show({
                controller: UpgradeDialogController,
                templateUrl: 'app/components/controls/ConfirmUpgrade.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        $rootScope.toggleLeft = buildDelayedToggler('left');

        function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = $rootScope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        function buildDelayedToggler(navId) {
            return debounce(function() {
                $mdSidenav(navId)
                    .toggle()
                    .then(function() {
                        fillSidenav(ctrl.user)
                    });
            }, 50);
        }

        function fillSidenav() {
            var user = localStorageService.get("user");
            if (!user.isDev) {
                $rootScope.sidenavMenuItems = [{
                    name: "My account",
                    url: "home",
                    tooltip: "Open home page"
                }, {
                    name: "History",
                    url: "history",
                    tooltip: "Open transactions history"
                }, {
                    name: "Buy (Shop)",
                    url: "shop",
                    tooltip: "Open shop"
                }, {
                    name: "Buy (Market)",
                    url: "market",
                    tooltip: "Open market"
                }, {
                    name: "Connect!",
                    url: "connect",
                    tooltip: "Connect new game account"
                }]
              }
              else {
                $rootScope.sidenavMenuItems = [{
                    name: "Account home",
                    url: "home",
                    tooltip: "Open home page"
                }, {
                    name: "History",
                    url: "history",
                    tooltip: "Open transactions history"
                }, {
                    name: "Markets",
                    url: "markets",
                    tooltip: "Open markets admin page"
                }, {
                    name: "Shops",
                    url: "shops",
                    tooltip: "Open controlled shops"
                }]
            }
        };

        ctrl.logout = function () {

            localStorageService.set("user", '');

          accountService.logout()
            .then(function () {
              $state.go('home');
            });

        };

        ctrl.checkLoggedIn = function() {
            $http.get('api/getAuthUser')
                .success(function(user){
                    console.log("check log in");
                    console.log(user);
                    localStorageService.set("user", user);
                });
        };


        ctrl.user = localStorageService.get("user");
        ctrl.checkLoggedIn();
        fillSidenav(ctrl.user);
        //$state.transitionTo('account.home', ctrl.user.username);
    }

    UpgradeDialogController.$inject = ['accountService', '$http', '$scope', '$rootScope', '$mdDialog'];

    function UpgradeDialogController(accountService, $http, $scope, $rootScope, $mdDialog) {
      var ctrl = this;

      $scope.hide = function() {
          $mdDialog.hide();
      }
      $scope.cancel = function() {
          $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
          $mdDialog.hide(answer);
      };

      ctrl.confirm = function () {
        accountService.upgradeToDev(localStorageService.get("user"))
          .then( function () {
            $rootScope.showAlert("U r dev now");
          })
      }
    }

})();
