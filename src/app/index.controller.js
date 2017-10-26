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

        var obj = { "MaxCompanyCount": 2, "MaxProductCount": 3, "MaxSellCount": 10 }



        var getLastTransaction = indexService.lastTransaction('transaction').then(function (res) {
            vm.lastTransaction = res[0];
            console.log(JSON.stringify(vm.lastTransaction))

        });

        function checkCompany(MaxCompanyCount) {
            var list = api.count('sellercompany').then(function (success) {
                vm.sellerCompanies = success;
                if (vm.sellerCompanies.length > 0) {
                    if (vm.lastTransaction.MaxCompanyCount == vm.sellerCompanies.length) {
                        $rootScope.rMaxCompany = true;
                    } else {
                        $rootScope.rMaxCompany = false;

                    }
                }

                else {
                    $rootScope.rMaxCompany = false;
                    console.log(' $rootScope.MaxCompanyCount', $rootScope.rMaxCompany)

                }
            }, function (error) {

            });
        }

        function checkProduct() {
            console.log('checkProduct')
            var list = api.count('sellerproduct').then(function (success) {
                vm.sellerProducts = success;
                console.log(vm.sellerProducts.length)
                if (vm.sellerProducts.length > 0) {
                    if (vm.lastTransaction.MaxProductCount == vm.sellerProducts.length) {
                        $rootScope.rMaxProduct = true;
                        console.log(' $rootScope.rMaxProduct', $rootScope.rMaxProduct)

                    } else {
                        $rootScope.rMaxProduct = false;
                        console.log(' $rootScope.rMaxProduct', $rootScope.rMaxProduct)


                    }
                }
                else {
                    $rootScope.rMaxProduct = false;
                    console.log(' $rootScope.rMaxProduct', $rootScope.rMaxProduct)

                }

            }, function (error) {
                console.log('error geting')

            });

        }



    }
})();