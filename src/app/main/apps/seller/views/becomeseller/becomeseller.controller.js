(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('becomeSellerController', becomeSellerController);

    /** @ngInject */
    function becomeSellerController(indexService, $scope, $state) {
        var vm = this;
        $scope.UserProfile = firebase.database().ref('usersProfile')
        vm.saveBecomeSeller = saveBecomeSeller;
        vm.formdata = {};
        vm.isFormValid = isFormValid;
        var getUsers = indexService.getUser();
        $scope.FBref = firebase.database().ref('seller/transation');
        vm.now = Date.now()
        vm.expirydate = Date.now()
        vm.expirydate.setDate(vm.expirydate.getDate() + 15);
        vm.purchasePackage = purchasePackage;
        vm.changePackage = changePackage;




        $scope.userRoles = firebase.database().ref('admin/userRoles')
        var list = indexService.getAll($scope.userRoles).$loaded(function (success) {
            vm.packages = success;
            vm.trialPackage = vm.packages[3];
            vm.formData = {
                // CompanyCategoryID: vm.trialPackage.$id,
                uid: getUsers,
                packageId: vm.trialPackage.$id,
                MaxCompanyCount: vm.trialPackage.MaxCompanyCount,
                MaxProductCount: vm.trialPackage.MaxProductCount,
                MaxSellCount: vm.trialPackage.MaxSellCount,
                purchaseDate: vm.now,
                expirydate: vm.expirydate
            }


        }, function (error) {
            indexService.errorMessage("error while getting data");

        });
        vm.create = function (createObject) {
            indexService.create($scope.FBref, createObject);
            vm.updateUserRole();

        }

        vm.updateUserRole = function () {
            var orderByChild = $scope.UserProfile.orderByChild("uid").equalTo(getUsers).on("child_added", function (data) {
                var obj = data.val();
                obj.userRole = 'seller';
                console.log(JSON.stringify(obj));
                indexService.update($scope.UserProfile, data.key, obj)
            });
            console.log('updateUserRole');


        }
        // Methods
        function saveBecomeSeller() {
            vm.create(vm.formData);
        }
        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }

        function changePackage() {



        }
        vm.handler = StripeCheckout.configure({
            key: 'pk_test_BfrgMjMHgcUujV73QMAGOgWU',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: responseToken
        });

        function purchasePackage(e) {
            vm.handler.open({
                name: 'Infinity',
                description: '2 widgets',
                zipCode: true,
                currency: 'aud',
                amount: vm.formData.package.price
            });
            e.preventDefault();
            window.addEventListener('popstate', function () {
                handler.close();
            });


        }

        function responseToken(token) {
            console.log(JSON.stringify(token))
        }


        $scope.stripeCallback = function (code, result) {
            if (result.error) {
                console.log('it failed! error: ' + result.error.message);
            } else {
                console.log('success! token: ' + result.id);
            }
        };

    }
})();