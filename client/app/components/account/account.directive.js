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

    AccountPageController.$inject = ['accountService', '$http', '$rootScope', '$mdDialog', '$state', '$mdSidenav', '$mdToast', '$timeout', '$log', '$stateParams', 'localStorageService'];

    function AccountPageController(accountService, $http, $rootScope, $mdDialog, $state, $mdSidenav, $mdToast, $timeout, $log, $stateParams ,localStorageService) {

        var ctrl = this;

        $rootScope.rootParam = $stateParams;
        //
        //if (localStorageService.get("user") === '') {
        //    accountService.getUser($rootScope.rootParam.nickname)
        //        .then( function (promise) {
        //            console.log("we are inside bullshit if");
        //            console.log($rootScope.rootParam.nickname);
        //            console.log(promise);
        //            localStorageService.set("user", promise);
        //            ctrl.user = localStorageService.get("user");
        //        })
        //}
        //ctrl.user = localStorageService.get("user");

        $rootScope.theme = 'default';

        $rootScope.changeTheme = function() {
          $rootScope.theme = $rootScope.theme === 'alternative' ? 'default' : 'alternative';
          console.log($rootScope.theme);
        };



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

        $rootScope.showToast = function(msg) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(msg)
              .hideDelay(2000)
          );
        };

        $rootScope.historyDialog = $mdDialog;
        $rootScope.upgradeDialog = $mdDialog;
        $rootScope.shops = [];

        $rootScope.showHistoryDialog = function(ev, transactions) {
            $rootScope.transactions = transactions;
            $rootScope.historyDialog.show({
                controller: HistoryDialogController,
                templateUrl: 'app/components/controls/HistorySheet.html',
                parent: angular.element(document.getElementById("theme-div")),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        $rootScope.showUpgradeDialog = function(ev) {
            $rootScope.upgradeDialog.show({
                controller: UpgradeDialogController,
                templateUrl: 'app/components/controls/ConfirmUpgrade.html',
                parent: angular.element(document.getElementById("theme-div")),
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
            var menuItems = [{
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
            }];
            if (!user.isDev) {
                if (user.wallet.length > 0) {
                    menuItems.push({
                        name: "Buy (Market)",
                        url: "buy",
                        tooltip: "Open market"
                    }, {
                        name: "Sell (Market)",
                        url: "sell",
                        tooltip: "Open market"
                    });
                }
                console.log(menuItems);
                $rootScope.sidenavMenuItems = menuItems;
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
                    if (user != 0) {
                        console.log("check log in");
                        console.log(user);
                        localStorageService.set("user", user);
                        fillSidenav();
                        $state.go('account.home');
                    }
                    else {
                        console.log("user not logged in");
                        $state.go('home');
                    }
                });
        };

        ctrl.userIsDev = function() {
            return localStorageService.get("user").isDev;
        }

        ctrl.checkLoggedIn();
        ctrl.user = localStorageService.get("user");

        //$state.transitionTo('account.home', ctrl.user.username);
    }

    UpgradeDialogController.$inject = ['accountService', '$http', '$scope', '$rootScope', '$state', '$mdDialog', 'localStorageService'];

    function UpgradeDialogController(accountService, $http, $scope, $rootScope, $state, $mdDialog, localStorageService) {
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

      $scope.confirm = function () {
            var user = localStorageService.get("user");
            console.log("we are confirmin");
            console.log(user);
            user.isDev = true;
            localStorageService.set("user", user);
            accountService.postUser(user)
            .then( function (promise) {
                $rootScope.showToast("U r dev now");
                $state.reload();
            });
      }
    }

})();
