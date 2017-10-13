(function () {
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($translateProvider, stripeProvider,$mdIconProvider) {
        stripeProvider.url = "https://js.stripe.com/v2/";

        stripeProvider.setPublishableKey('pk_test_BfrgMjMHgcUujV73QMAGOgWU');

        // var stripe = Stripe('pk_test_BfrgMjMHgcUujV73QMAGOgWU');
        // angular-translate configuration
        $mdIconProvider
            .iconSet('social', 'img/icons/sets/social-icons.svg', 16)
            .defaultIconSet('img/icons/sets/core-icons.svg', 16);

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');


    }

})();