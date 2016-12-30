(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  config.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider', '$httpProvider', '$compileProvider', '$mdIconProvider', '$mdThemingProvider', 'ChartJsProvider'];

  function config($translateProvider, tmhDynamicLocaleProvider, $httpProvider, $compileProvider, $mdIconProvider, $mdThemingProvider, ChartJsProvider) {

    // Angular perfs best practices
    $httpProvider.useApplyAsync(true);
    $compileProvider.debugInfoEnabled(false);

    // i18n angular-translate
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/app-locale_',
      suffix: '.json'
    });
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useLocalStorage();

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('pink');

    $mdThemingProvider.theme('alternative')
        .primaryPalette('orange')
        .accentPalette('cyan')
        .backgroundPalette('grey',{
            'default':'900',
        })
        .dark();

    $mdThemingProvider.alwaysWatchTheme(true);

    // i18n angular-dynamic-locale
    tmhDynamicLocaleProvider.localeLocationPattern('/i18n/angular/angular-locale_{{locale}}.js');

    ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });

    $mdIconProvider.icon("google_plus", "/styles/svg/google_plus.svg", 512).icon("twitter", "/styles/svg/twitter.svg", 512).icon("facebook", "/styles/svg/facebook.svg", 512).icon("vk", "./assests/svg/vk.svg", 512);
  }
})();
