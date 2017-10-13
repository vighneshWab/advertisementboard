(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('becomeSellerController', becomeSellerController);

    /** @ngInject */
    function becomeSellerController(indexService, $scope, api, $window, stripe, $state) {
        var vm = this;
        vm.formData = {};
        vm.createCustomer = createCustomer;
        vm.isFormValid = isFormValid;
        vm.stripe_subscription = stripe_subscription;
        vm.user = api.getUserRole();
        var userid = vm.user.$id;
        $scope.stripeCallback = stripeCallback;
        var list = api.getAll('admin/userRoles').then(function (success) {
            vm.packages = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");
        });
        function stripeCallback() {
            console.log('stripeCallback');
            stripe.card.createToken($scope.payment.card)
                .then(function (response) {
                    console.log('token created for card ending in ');
                    var customer = {
                        email: vm.user.email,
                        source: response.id
                    }
                    vm.createCustomer(customer);
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
        function isFormValid(formName) {
            console.log('isFormValid')
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }

        function createCustomer(customer) {
            api.postdata('customer_seller', customer).then(function (response) {
                console.log('customer ID', response.id);
                var subcription = {
                    customer: response.id,
                    plan: vm.formData.package.$id
                }
                vm.stripe_subscription(subcription);
            }, function (error) {
                console.log('error while createiing customer');
            });
        }
        function stripe_subscription(plan) {
            // subscription
            api.postdata('trial_subscription', plan).then(function (response) {
                console.log('trial periode created');
                vm.user.userRole = 'seller';
                vm.user.subcription = response.id;
                vm.user.customerID=response.customer;
                var user = vm.user;
                delete user.$id;
                delete user.$priority;

                // update user userRoles
                api.update('user', userid, user).then(function (response) {
                    console.log('update  user role', response);
                    api.setRole(vm.user);
                    delete vm.formData.package.$id;
                    delete vm.formData.package.$priority;
                    // { "CategoryDescription":"Can add 50 Products and 10 comapnies", "MaxCompanyCount":10, "MaxProductCount":50, "MaxSellCount":100, "UserRole":"Bronze", "isTrial":false, "price":10 }
                    var transaction = {
                        MaxCompanyCount: vm.formData.package.MaxCompanyCount,
                        MaxProductCount: vm.formData.package.MaxProductCount,
                        MaxSellCount: vm.formData.package.MaxSellCount,
                        created: indexService.createdDate,
                        expired: indexService.expireDate30
                    }
                    api.insert('transaction', transaction).then(function (response) {
                        console.log('transaction created');
                        indexService.sucessMessage('you become a seller now');
                        localStorage.clear();
                        $state.go('app.pages_auth_login');

                    }, function (error) {
                        console.log('error while createiing transaction');
                    });

                }, function (error) {
                    console.log('error while updateing user role');
                });

            }, function (error) {
                console.log('error while createiing subscription');

            })






        }








    }
})();