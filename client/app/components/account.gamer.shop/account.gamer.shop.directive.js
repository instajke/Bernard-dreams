(function () {
    'use strict';
    angular.module('app').directive('gamershop', function () {
        return {
            restrict: 'E'
            , templateUrl: '/app/components/account.gamer.shop/account.gamer.shop.template.html'
            , controller: gamerShopCtrl
            , controllerAs: 'shopCtrl'
            , bindToController: true
        };
    });
    gamerShopCtrl.$inject = ['accountService', 'marketService', '$http', '$mdToast', '$scope', '$rootScope', '$mdDialog', '$q', 'localStorageService', '$window'];

    function gamerShopCtrl(accountService, marketService, $http,  $mdToast, $scope, $rootScope, $mdDialog, $q, localStorageService, $window) {
        var ctrl = this;

        ctrl.connectShopDlg = $mdDialog;

        $scope.currentMarket = {};

        $scope.showMarkets = function() {
            $scope.availableMarkets = $scope.markets;

            var indexes = [];

            console.log("SHOW ALL AVAIL MARKETS");
            console.log($scope.availableMarkets);
            console.log("LOCAL STOR WALLET LENGTH");
            console.log(localStorageService.get("user").wallet.length);

            for (var index = 0; index < $scope.availableMarkets.length; index++) {
                for (var jndex = 0; jndex < localStorageService.get("user").wallet.length; jndex++) {

                    if ($scope.availableMarkets[index]._id === $scope.currentUser.wallet[jndex].marketID)
                        {
                            indexes.push(index);
                        }
                }
            }
            var indexesSet = new Set(indexes);
            console.log(indexesSet);
            var indexes = Array.from(indexesSet);
            console.log(indexes.length);
            console.log(indexes);
            while (indexes.length > 0) {
                $scope.availableMarkets.splice(indexes[indexes.length - 1], 1);
                indexes.splice(indexes.length - 1, 1);
                console.log(indexes);
                console.log($scope.availableMarkets);
            }
            console.log("excluding markets - done");

        };

        ctrl.getShopsByMarketId = function() {
            var userMarkets = [];
            var deferred = $q.defer();

            console.log("we are inside get shops by market id");

                localStorageService.get("user").wallet.forEach(function(item) {
                    userMarkets.push(item.marketID);
                    console.log("array of marketID");
                    console.log(userMarkets);
                    $http.post('/api/shops', userMarkets)
                        .success(function(data, status) {
                            console.log("i hate myself");
                            console.log(data);
                            if (status === 200) {
                                deferred.resolve(data);
                                console.log("got shops");
                                console.log(data)
                            }
                            else {
                                deferred.reject();
                            }
                        })
                        .error (function (data) {
                            console.log("error");
                            deferred.reject();
                        });
                });

            return deferred.promise;
        };

        $scope.initMarkets = function () {
                $scope.currentUser = localStorageService.get("user");

                marketService.getMarkets().then
                (function (promise) {
                    console.log("initializing markets");
                    console.log(promise);
                    $scope.markets = promise.markets;
                    $scope.showMarkets();
                    console.log("so we have following markets: ")
                    console.log($scope.markets);
                    console.log($scope.availableMarkets);
                    ctrl.getShopsByMarketId().then
                    (function (promise) {
                        $scope.shops = promise.shops;
                        console.log("what the fuck");
                        console.log($scope.shops);
                    })
                })
        };

        ctrl.showConnectShopDialog = function (ev) {
            //$scope.initMarkets();
            ctrl.connectShopDlg.show({
                controller: gamerShopCtrl
                , templateUrl: 'app/components/controls/ConnectShop.html'
                , parent: angular.element(document.getElementById("theme-div"))
                , targetEvent: ev
                , scope: $scope
                , preserveScope: true
                , clickOutsideToClose: true
            });
        };

        ctrl.getMarketsConnectedToUser = function() {
            var deferred = $q.defer();

            console.log("We are inside get markets conn to user");

            $http.get('/api/usersshop/' + $scope.currentUser._id)
                .success(function(data, status) {
                    console.log("i hate myself");
                    console.log(data);
                    if (status === 200) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject();
                    }
                })
                .error (function (data) {
                    console.log("error");
                    deferred.reject();
                });

                return deferred.promise;
        };

        $scope.transaction = function(shop, offer, user) {
            var deferred = $q.defer();

            $http.post('/api/paypal/approve', { marketID : shop.marketID,
                                            offer : offer,
                                            devPayPalAcc : shop.payPalAcc,
                                            gamerID : user._id })
                .success(function(data, status) {
                    console.log("paypal");
                    console.log(data);
                    $window.location.href = data;
                    if (status === 200) {
                        deferred.resolve(data);
                        console.log("STATUS 200 DATA");
                        console.log(data);
                    }
                    else {
                        deferred.reject();
                    }
                })
                .error (function (data) {
                    console.log("error");
                    deferred.reject();
                });

                return deferred.promise;
        };

        $scope.showSimpleToast = function(msg) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    .hideDelay(2000)
            );
        };

        $scope.connect = function () {
            var market = $scope.availableMarkets[$scope.currentMarket.marketID];
            console.log("current market: ");
            console.log(market);

            var wallet1 = {
                currencyType: market.currencyType1
                , amount: 0
                , marketID: market._id
            };
            var wallet2 = {
                currencyType: market.currencyType2
                , amount: 5000
                , marketID: market._id
            };
            var transaction = {
                currencyType : market.currencyType2,
                amount : 5000,
                marketID : market._id,
                transactionType : "Gift for connecting shop"
            };

            console.log(wallet1);
            console.log(wallet2);
            console.log(transaction);

            var user = localStorageService.get("user");
            console.log("CURRENT USER");
            console.log(user);
            user.wallet.push(wallet1);
            user.wallet.push(wallet2);
            user.transactions.push(transaction);
            console.log("CURRENT USER WITH UPDATED WALLET");
            console.log(user);
            accountService.postUser(user)
                .then( function(promise) {
                    ctrl.connectShopDlg.hide();
                    localStorageService.set("user", user);
                    $scope.initMarkets();
                    $scope.showSimpleToast("Shop connected. Check your transactions to see your gift.");
                });
        };

        $scope.initMarkets();
    }
})();
