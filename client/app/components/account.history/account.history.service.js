(function() {
  'use strict';

  angular
    .module('app')
    .service('historyService', ['$q', '$http','$timeout', '$rootScope', historyService]);

    function historyService($q, $http, $timeout, $rootScope) {

      return {

          groupBy : function( array , f ) {
            var groups = {};
            array.forEach( function( o )
            {
              var group = JSON.stringify( f(o) );
              groups[group] = groups[group] || [];
              groups[group].push( o );
            });
            return Object.keys(groups).map( function( group )
            {
              return groups[group];
            })
          },

          processTransactions : function(transactions) {

              transactions.forEach(function(item) {
                  item.date = Date.parse(item.date) - Date.parse(item.date) % 1000;
              })

              var finalTranses = [];

              function groupBy( array , f )
              {
                var groups = {};
                array.forEach( function( o )
                {
                  var group = JSON.stringify( f(o) );
                  groups[group] = groups[group] || [];
                  groups[group].push( o );
                });
                return Object.keys(groups).map( function( group )
                {
                  return groups[group];
                })
              }

              var result = groupBy(transactions, function(item)
              {
                return [item.date];
              });

              console.log("result of grouping");
              console.log(result);

              result.forEach(function(item) {
                      var finalTrans = {};
                      if (item.length > 1) {
                          finalTrans.outcomingAmount = item[0].amount;
                          finalTrans.outcomingCurrency = item[0].currencyType;
                          finalTrans.incomingAmount = item[1].amount;
                          finalTrans.incomingCurrency = item[1].currencyType;
                          finalTrans.marketID = item[0].marketID;
                          finalTrans.date = item[0].date;
                          //if (item[2].transactionType) {
                        //      finalTrans.transDescr = item[2].transactionType;
                          //}
                      }
                      else {
                          finalTrans.amount = item[0].amount;
                          finalTrans.currencyType = item[0].currencyType;
                          finalTrans.marketID = item[0].marketID;
                          finalTrans.date = item[0].date;
                      }
                      finalTranses.push(finalTrans);
              });

              console.log("result of merging");
              console.log(finalTranses);

              return finalTranses;
          }
      };
    }
})();
