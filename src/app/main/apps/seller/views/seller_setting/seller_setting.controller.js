(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('seller_setting', seller_setting)
    // .controller('addCardController', addCardController)


    /** @ngInject */
    function seller_setting(indexService, $scope, stripe, $mdDialog, api, $state) {
        var vm = this;
        vm.isFormValid = isFormValid;
        vm.updatePackage = updatePackage;
        vm.getProfile = getProfile;
        vm.updateProfile = updateProfile;
        vm.getPaymentDetails = getPaymentDetails;
        vm.stopbecomeseller = stopbecomeseller;

        vm.getRole = api.getUserRole();
        var userid = vm.getRole.$id;
        var getUsers = indexService.getUser();
        $scope.stripeCallback = stripeCallback;
        vm.mulipleSource = mulipleSource;
        vm.defult_scource = defult_scource;
        vm.defult_scource_card = defult_scource_card


        var list = api.getAll('admin/userRoles').then(function (success) {
            vm.packages = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");
        });

        // Methods
        function isFormValid(formName) {
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
            var getUsers = indexService.getUser();

            api.getUserData('user', getUsers).then(function (success) {
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
            var data = {
                customer: vm.user.customerID
            }
            api.postdata('customer_details', data).then(function (response) {
                vm.sources = response.sources.data;
                // vm.subscriptions = vm.payment.subscriptions.data[0].items.data[0].plan.id;
            }, function (error) {
                console.log('error while createiing customer');
            });
        }
        // sellercompany

        function stopbecomeseller() {
            api.deletedata('customer', vm.getRole.customerID).then(function (response) {
                console.log(response);
                api.userWiseData('sellerproduct').then(function (res) {
                    var products = res;
                    var bulkdisbleupdate = {};
                    for (var i = 0; i < products.length; i++) {
                        var loca = products[i].$id + '/disable';
                        bulkdisbleupdate[loca] = true;
                        var uid_disable = products[i].$id + '/uid_disable';
                        bulkdisbleupdate[uid_disable] = getUsers + "_" + true;
                    }
                    api.bulkupdate('sellerproduct', bulkdisbleupdate).then(function (res) {
                        // disable comapnies
                        api.userWiseData('sellercompany').then(function (res) {
                            var companies = res;
                            var bulkdisbleupdate = {};
                            for (var i = 0; i < companies.length; i++) {
                                var loca = companies[i].$id + '/disable';
                                bulkdisbleupdate[loca] = true;
                                var uid_disable = companies[i].$id + '/uid_disable';
                                bulkdisbleupdate[uid_disable] = getUsers + "_" + true;
                            }
                            api.bulkupdate('sellercompany', bulkdisbleupdate).then(function (res) {
                                api.getUserData('user', getUsers).then(function (success) {
                                    vm.user = success[0];
                                    var id = vm.user.$id;
                                    var userdata = vm.getRole;
                                    userdata.userRole = 'buyer';
                                    delete userdata.customerID;
                                    delete userdata.subcription;
                                    delete userdata.$id;
                                    delete userdata.$priority;

                                    api.update('user', id, userdata).then(function (res) {
                                        $state.go('app.pages_auth_login');
                                        
                                    }, function (err) {
                                        console.log('error', err)
                                    })

                                }, function (error) {

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


        function stripeCallback() {
            console.log('stripeCallback');

            var seprate = $scope.payment.card.expiry.split("/");
            $scope.payment.card.exp_month = seprate[0];
            $scope.payment.card.exp_year = seprate[1];
            delete $scope.payment.card.expiry

            stripe.card.createToken($scope.payment.card)
                .then(function (response) {
                    console.log('token created for card ending in ');
                    var card = {
                        customer: vm.getRole.customerID,
                        source: response.id
                    }
                    $scope.payment = {}
                    vm.mulipleSource(card);
                })
                .catch(function (err) {
                    if (err.type && /^Stripe/.test(err.type)) {
                        console.log('Stripe error: ', err.message)
                    }
                    else {
                        console.log('Other error occurred, possibly with your API', err.message)
                    }
                })

        };


        function mulipleSource(customer) {
            api.postdata('create_source', customer).then(function (response) {
                vm.defult_scource(sourcId);
            }, function (error) {
                console.log('error while createiing customer');
            });

        }

        function defult_scource(id) {
            var defultS = {
                customer: vm.getRole.customerID,
                source: id
            }

            api.postdata('defult_source', defultS).then(function (response) {
                indexService.sucessMessage("Card Inserted successfully")
                vm.getPaymentDetails();
                $scope.payment = {}
            }, function (error) {
                console.log('error while createiing customer');

            });

        }

        function defult_scource_card(id) {
            console.log('defult_scource')
            var defultS = {
                customer: vm.getRole.customerID,
                source: id
            }

            api.postdata('defult_source', defultS).then(function (response) {
                console.log('customer ID', response);
                indexService.sucessMessage("Card Updated successfully")
                // vm.getPaymentDetails();
                $scope.payment = {}
            }, function (error) {
                console.log('error while createiing customer');

            });

        }

    }


})();