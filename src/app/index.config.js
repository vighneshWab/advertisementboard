(function () {
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($translateProvider, stripeProvider) {
        stripeProvider.url="https://js.stripe.com/v2/";

        stripeProvider.setPublishableKey('pk_test_BfrgMjMHgcUujV73QMAGOgWU');

        // var stripe = Stripe('pk_test_BfrgMjMHgcUujV73QMAGOgWU');
        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');


    }

})();