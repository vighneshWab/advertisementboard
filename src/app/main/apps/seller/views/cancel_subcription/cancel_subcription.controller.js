(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('cancel_subcriptionController', cancel_subcriptionController);

    /** @ngInject */
    function cancel_subcriptionController(indexService, $scope, api, $state) {
        var vm = this;
        vm.isFormValid = isFormValid;
        vm.cancel_subsciption = cancel_subsciption;
        vm.getRole = api.getUserRole();
        vm.gotoLogin = gotoLogin;


        var list = api.getAll('admin/userRoles').then(function (success) {
            vm.packages = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");
        });

        // Methods
        function isFormValid(formName) {
            console.log('isFormValid')
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }

        function gotoLogin() {
            $state.go('app.pages_auth_login');
        }

        function cancel_subsciption() {
            var subcription = {
                customer: vm.getRole.customerID,
                plan: vm.formData.package.$id,
                subcription: vm.getRole.subcription
            }
            console.log('subsciptions', JSON.stringify(subcription))
            api.postdata('update_subsciption', subcription).then(function (response) {
                console.log('update_subsciption', response.id);
                var transaction = {
                    MaxCompanyCount: vm.formData.package.MaxCompanyCount,
                    MaxProductCount: vm.formData.package.MaxProductCount,
                    MaxSellCount: vm.formData.package.MaxSellCount,
                    created: indexService.createdDate,
                    expired: indexService.expireDate30
                }
                api.insert('transaction', transaction).then(function (response) {
                    console.log('transaction created');

                }, function (error) {
                    console.log('error while createiing transaction');
                });
            }, function (error) {
                console.log('error while createiing customer');
            });



        }






    }
})();