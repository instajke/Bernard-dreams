(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  config.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider', '$httpProvider', '$compileProvider', '$mdIconProvider', '$mdThemingProvider'];

  function config($translateProvider, tmhDynamicLocaleProvider, $httpProvider, $compileProvider, $mdIconProvider, $mdThemingProvider) {

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
        .primaryPalette('pink');

    $mdThemingProvider.theme('altTheme')
        .dark();

    // i18n angular-dynamic-locale
    tmhDynamicLocaleProvider.localeLocationPattern('/i18n/angular/angular-locale_{{locale}}.js');

    $mdIconProvider.icon("google_plus", "/styles/svg/google_plus.svg", 512).icon("twitter", "/styles/svg/twitter.svg", 512).icon("facebook", "/styles/svg/facebook.svg", 512).icon("vk", "./assests/svg/vk.svg", 512);
  }
})();
