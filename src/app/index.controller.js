(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, indexService, msNavigationService, api, $rootScope) {
        var vm = this;
        // Data
        vm.themes = fuseTheming.themes;
        $rootScope.checkCompany = checkCompany;
        $rootScope.checkProduct = checkProduct;
        function checkCompany(MaxCompanyCount) {
            var list = api.count('sellercompany').then(function (success) {
                vm.sellerCompanies = success;
                if (vm.sellerCompanies.length > 0) {
                    if ($rootScope.lastTransaction.MaxCompanyCount == vm.sellerCompanies.length) {
                        $rootScope.rMaxCompany = true;
                    } else {
                        $rootScope.rMaxCompany = false;

                    }
                }

                else {
                    $rootScope.rMaxCompany = false;

                }
            }, function (error) {
                console.log('error checkCompant',error)
                

            });
        }

        function checkProduct() {
            var list = api.count('sellerproduct').then(function (success) {
                vm.sellerProducts = success;
                if (vm.sellerProducts.length > 0) {
                    if ($rootScope.lastTransaction.MaxProductCount == vm.sellerProducts.length) {
                        $rootScope.rMaxProduct = true;

                    } else {
                        $rootScope.rMaxProduct = false;


                    }
                }
                else {
                    $rootScope.rMaxProduct = false;

                }

            }, function (error) {
                console.log('error checkProduct',error)

            });

        }



    }
})();