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

    AccountPageController.$inject = ['$http', '$rootScope', '$mdDialog', '$state', '$mdSidenav', '$timeout', '$log', '$stateParams'];

    function AccountPageController($http, $rootScope, $mdDialog, $state, $mdSidenav, $timeout, $log, $stateParams) {
        $rootScope.rootParam = $stateParams;
        $state.transitionTo('account.home', $stateParams);

        var ctrl = this;

        ctrl.user = { userId : 'id1', name : 'name', picture : 'picture', payPalAcc : 'payPalAcc' };

        $rootScope.pageClass = "page-account";

        ctrl.param = $stateParams;

        $rootScope.transactions = [];
        $rootScope.currentTrans = {};
        $rootScope.transDialog = $mdDialog;
        $rootScope.historyDialog = $mdDialog;
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
            if (!ctrl.user.isDev) {
                $rootScope.sidenavMenuItems = [{
                    name: "My account",
                    url: "home",
                    tooltip: "Open home page"
                }, {
                    name: "History",
                    url: "history",
                    tooltip: "Open transactions history"
                }, {
                    name: "Buy",
                    url: "buy",
                    tooltip: "Open shop"
                }, {
                    name: "Connect!",
                    url: "connect",
                    tooltip: "Connect new game account"
                }, {
                    name: "Upgrade!",
                    url: "upgrade",
                    tooltip: "Upgrade your account type"
                }]
            } else {
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
                    name: "Connect!",
                    url: "connect",
                    tooltip: "Create new game market"
                }]
            }
        }

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

    SidenavController.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];

})();
