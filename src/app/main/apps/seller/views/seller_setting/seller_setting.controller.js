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
        vm.stopbecomeseller = stopbecomeseller;
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
                // vm.sources = vm.payment.sources.data;
                vm.subscriptions = vm.payment.subscriptions.data[0].items.data[0].plan.id;

                console.log('customer_details', response);

            }, function (error) {
                console.log('error while createiing customer');
            });



        }

        // sellercompany

        function stopbecomeseller() {
            api.deletedata('customer', vm.getRole.customerID).then(function (response) {
                console.log(response);

                // diable all products and comanies of user

                api.userWiseData('sellerproduct').then(function (res) {
                    console.log('res', res)
                    var products = res;
                    var bulkdisbleupdate = {};
                    for (var i = 0; i < products.length; i++) {
                        var loca = products[i].$id + '/disable';
                        bulkdisbleupdate[loca] = true;
                    }
                    api.bulkupdate('sellerproduct', bulkdisbleupdate).then(function (res) {
                        console.log('res', res)

                        // disable comapnies
                        api.userWiseData('sellercompany').then(function (res) {
                            console.log('res', res)
                            var companies = res;
                            var bulkdisbleupdate = {};
                            for (var i = 0; i < companies.length; i++) {
                                var loca = companies[i].$id + '/disable';
                                bulkdisbleupdate[loca] = true;
                            }
                            api.bulkupdate('sellercompany', bulkdisbleupdate).then(function (res) {
                                console.log('res', res)

                                var userdata = vm.getRole;
                                userdata.role = 'buyer';
                                delete userdata.customerID;
                                delete userdata.subcription;
                                delete userdata.$id;
                                delete userdata.$priority;

                                api.bulkupdate('user', userdata).then(function (res) {
                                    console.log('user', res)

                                }, function (err) {
                                    console.log('error', err)
                                })

                            }, function (err) {
                                console.log('error', err)
                            })

                        }, function (err) {
                            console.log('error', err)
                        })





                    }, function (err) {
                        console.log('error', err)
                    })

                }, function (err) {
                    console.log('error', err)
                })







            }, function (error) {
                indexService.sucessMessage('error while')
            });

        }






    }
})();