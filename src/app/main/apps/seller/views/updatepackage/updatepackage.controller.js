(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('UpdatePackage', UpdatePackage);

    /** @ngInject */
    function UpdatePackage(indexService, $scope, $filter, api, $mdDialog, $state) {
        var vm = this;
        vm.isFormValid = isFormValid;
        vm.updatePackage = validateCount;
        vm.getRole = api.getUserRole();
        vm.formData = {}

        var getLastTransaction = indexService.lastTransaction('transaction').then(function (res) {
            vm.lastTransaction = res[0];
            vm.packageId = vm.lastTransaction.packageId
        });
        var list = api.getAll('admin/userRoles').then(function (success) {
            vm.packages = success;

        }, function (error) {
            indexService.errorMessage("error while getting data");
        });
        vm.showConfirm = showConfirm;

        // Methods
        function isFormValid(formName) {
            console.log('isFormValid')
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }


        var listproducts = api.count('sellerproduct').then(function (success) {
            vm.enabledProducts = success;
            vm.productCount = vm.enabledProducts.length;
            // vm.productCount = 200;

        });

        var listproducts = api.count('sellercompany').then(function (success) {
            vm.enabledCompanies = success;
            vm.companyCount = vm.enabledCompanies.length;
            // vm.companyCount = 8;
        });

        function gotoProduct(id) {
            $state.go('app.seller.products.detail', { id: id });
        };

        function validateCount(ev) {
            if (vm.lastTransaction.MaxCompanyCount > vm.formData.package.MaxCompanyCount) {
                console.log('current Active  Package', vm.lastTransaction);
                console.log('selected downgrad Package', vm.formData.package);
                if (vm.companyCount > vm.formData.package.MaxCompanyCount) {
                    var needTodiabledComanyCount = vm.companyCount - vm.formData.package.MaxCompanyCount
                    console.log('total number of enabled companies are greated then selected package', needTodiabledComanyCount);
                    // Appending dialog to document.body to cover sidenav in docs 

                    var textContent = 'You have to disable  ' + needTodiabledComanyCount + '  companies';
                    var confirm = $mdDialog.confirm()
                        .title('You have choice downgrad Package ')
                        .textContent(textContent)
                        .ariaLabel('Lucky day')
                        .targetEvent(ev)
                        .ok('Disable Companies')
                        .cancel('NO');
                    $mdDialog.show(confirm).then(function (res) {
                        // YES pressed
                        $state.go('app.seller.sellercompanies');


                    }, function () {
                        // NO Pressed

                    });

                } else {
                    console.log('enabled comapnies are less then selected count')
                    vm.commpanyLess = true;
                    if (vm.productCount > vm.formData.package.MaxProductCount) {
                        var needTodiabledComanyCount = vm.productCount - vm.formData.package.MaxProductCount
                        console.log('total number of enabled products are greated then selected package', needTodiabledComanyCount);

                        var textContent = 'You have to disable  ' + needTodiabledComanyCount + '  Products';
                        var confirm = $mdDialog.confirm()
                            .title('You have chice downgrade Package ')
                            .textContent(textContent)
                            .ariaLabel('Lucky day')
                            .targetEvent(ev)
                            .ok('Disable Product')
                            .cancel('NO');
                        $mdDialog.show(confirm).then(function (res) {
                            // YES pressed
                            $state.go('app.seller.products');


                        }, function () {
                            // NO Pressed

                        });
                    } else {
                        vm.productsLess = true;
                        console.log('enabled products are less then selected count')
                        if (vm.commpanyLess == vm.productsLess == true) {
                            updatePackage();


                        }

                    }
                }


            } else {
                console.log('selected upggrated Package');
                updatePackage();
            }


        }



        function updatePackage() {
            var subcription = {
                customer: vm.getRole.customerID,
                plan: vm.formData.package.$id,
                subcription: vm.getRole.subcription
            }
            api.postdata('update_subsciption', subcription).then(function (response) {
                var transaction = {
                    packageId: vm.formData.package.$id,
                    MaxCompanyCount: vm.formData.package.MaxCompanyCount,
                    MaxProductCount: vm.formData.package.MaxProductCount,
                    MaxSellCount: vm.formData.package.MaxSellCount,
                    created: indexService.createdDate,
                    expired: indexService.expireDate30
                }
                var getUsers = indexService.getUser();
                api.insert_transaction('transaction', getUsers, transaction).then(function (response) {
                    console.log('transaction created');
                    indexService.errorMessage('Package has been updated successfully')

                }, function (error) {
                    console.log('error while createiing transaction');
                });
            }, function (error) {
                console.log(' error while update_subsciption');
            });



        }
        function showConfirm(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('You have reached max count limit')
                .textContent('Upgrade package or diable products')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Update Package')
                .cancel('NO');
            if (vm.products.length <= vm.lastTransaction.MaxProductCount) {
                vm.gotoAddProduct();
            } else {
                $mdDialog.show(confirm).then(function (res) {
                    // YES pressed
                    $state.goto('app.seller.UpdatePackage');

                }, function () {
                    // NO Pressed

                });

            }

        };









    }
})();