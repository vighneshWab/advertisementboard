(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('seller_setting', seller_setting);

    /** @ngInject */
    function seller_setting(indexService, $scope, api, $state) {
        var vm = this;
        vm.isFormValid = isFormValid;
        vm.updatePackage = updatePackage;
        vm.getProfile = getProfile;
        vm.updateProfile = updateProfile;
        vm.getPaymentDetails = getPaymentDetails;
        vm.getRole = api.getUserRole();
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




        function updatePackage() {
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

        function getProfile() {
            api.getUserProfile().then(function (success) {
                console.log(success)

                vm.user = success[0]
                if (vm.user) {
                    vm.getPaymentDetails()
                }
            }, function (error) {

            })
        }
        vm.getProfile();

        function updateProfile() {
            var childId = vm.user.$id
            delete vm.user.$id;
            delete vm.user.$priority;
            api.update('user', childId, vm.user).then(function (success) {
                indexService.sucessMessage('Profile updated success');
            }, function (error) {
                indexService.errorMessage('error while updaing Profile');

            })

        }


        function getPaymentDetails() {
            console.log('getPaymentDetails')

            var data = {
                customer: vm.user.customerID
            }

            api.postdata('customer_details', data).then(function (response) {
                vm.payment = response;
                vm.sources = vm.payment.sources.data;
                vm.subscriptions = vm.payment.subscriptions.data[0].items.data[0].plan.id;

                console.log('customer_details', response);

            }, function (error) {
                console.log('error while createiing customer');
            });



        }






    }
})();