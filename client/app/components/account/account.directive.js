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

    AccountPageController.$inject = ['accountService', '$http', '$rootScope', '$mdDialog', '$state', '$mdSidenav', '$timeout', '$log', '$stateParams'];

    function AccountPageController(accountService, $http, $rootScope, $mdDialog, $state, $mdSidenav, $timeout, $log, $stateParams) {

        var ctrl = this;

        $rootScope.rootParam = $stateParams;

        ctrl.user = {};

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

        $rootScope.transactions = [];
        $rootScope.currentTrans = {};
        $rootScope.transDialog = $mdDialog;
        $rootScope.historyDialog = $mdDialog;
        $rootScope.upgradeDialog = $mdDialog;
        $rootScope.shops = [];

        ctrl.getTransactions = function() {
            $http.get('/api/things')
                .then(function(response) {
                    $rootScope.transactions = response.data;
                });
        };

        ctrl.postTrans = function() {
            $http.post('/api/things', ctrl.trans)
                .then(function() {
                    ctrl.status = 'OK';
                });
        };

        $rootScope.showTransDialog = function(ev, trans) {
            $rootScope.currentTrans = trans;
            $rootScope.transDialog.show({
                controller: TransDialogController,
                templateUrl: 'app/components/controls/DetailedItemInfo.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

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
                        $log.debug("toggle " + navId + " is done");
                    });
            }, 50);
        }

        $rootScope.fillSidenav = fillSidenav($rootScope.user);

        function fillSidenav(user) {
            if (ctrl.user.isDev === false) {
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
        }

        ctrl.logout = function () {

          accountService.logout()
            .then(function () {
              $state.go('home');
            });

        };

        ctrl.user = accountService.getUser($rootScope.rootParam.nickname).$$state.value;
        console.log(ctrl.user);
        $state.transitionTo('account.home', $stateParams);
        ctrl.getTransactions();
    }

    TransDialogController.$inject = ['$http', '$scope', '$rootScope', '$mdDialog'];

    function TransDialogController($http, $scope, $rootScope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
        $scope.trans = $rootScope.currentTrans;
    }

    HistoryDialogController.$inject = ['$http', '$scope', '$rootScope', '$mdDialog'];

    function HistoryDialogController($http, $scope, $rootScope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        }
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
        $scope.transactions = $rootScope.transactions;
        $scope.showTransDialog = $rootScope.showTransDialog;
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
        accountService.upgradeToDev($rootScope.rootParam.nickname)
          .then( function () {
            $rootScope.showAlert("U r dev now");
          })
      }
    }

})();
