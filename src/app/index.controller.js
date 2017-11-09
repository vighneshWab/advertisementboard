(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $q, indexService, msNavigationService, api, $rootScope) {
        var vm = this;
        // Data
        vm.themes = fuseTheming.themes;
        $rootScope.checkCompany = checkCompanyPromise;
        $rootScope.checkProduct = checkProductPromise;

        function getSubcription() {
            console.log('getSubcription');
            var userD = api.getUserRole();
            console.log('userD', userD);

            var url = "subscription" + "/" + userD.subcription
            console.log(url)

            api.getdata(url).then(function (success) {
                console.log(success);
            });
        }




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
                console.log('error checkCompant', error)
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
                console.log('error checkProduct', error)

            });

        }



        // function with promoise

        function checkCompanyPromise(MaxCompanyCount) {
            getSubcription();

            var qProfile = $q.defer();
            var list = api.count('sellercompany').then(function (success) {
                vm.sellerCompanies = success;
                if (vm.sellerCompanies.length > 0) {
                    if ($rootScope.lastTransaction.MaxCompanyCount == vm.sellerCompanies.length) {
                        $rootScope.rMaxCompany = true;
                        qProfile.resolve($rootScope.rMaxCompany);
                    } else {
                        $rootScope.rMaxCompany = false;
                        qProfile.resolve($rootScope.rMaxCompany);


                    }
                }

                else {
                    $rootScope.rMaxCompany = false;
                    qProfile.resolve($rootScope.rMaxCompany);


                }
            }, function (error) {
                console.log('error checkCompant', error)
                qProfile.reject(error);



            });

            return qProfile.promise;

        }


        function checkProductPromise() {
            var qProfile = $q.defer();
            var list = api.count('sellerproduct').then(function (success) {
                vm.sellerProducts = success;
                if (vm.sellerProducts.length > 0) {
                    if ($rootScope.lastTransaction.MaxProductCount == vm.sellerProducts.length) {
                        $rootScope.rMaxProduct = true;
                        qProfile.resolve($rootScope.rMaxProduct);

                    } else {
                        $rootScope.rMaxProduct = false;
                        qProfile.resolve($rootScope.rMaxProduct);


                    }
                }
                else {
                    $rootScope.rMaxProduct = false;
                    qProfile.resolve($rootScope.rMaxProduct);

                }

            }, function (error) {
                console.log('error checkProduct', error)
                qProfile.reject(error);
            });
            return qProfile.promise;
        }


    }
})();