(function () {
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(indexService, $scope, $rootScope, api, msNavigationService, $state) {
        // Data
        var vm = this;

        vm.gotoBuyer = gotoBuyer;
        vm.gotoSeller = gotoSeller;
        vm.gotoAdmin = gotoAdmin;


        // Methods
        $scope.FBRef = firebase.database().ref("usersProfile");

        vm.login = function (formData) {
            console.log('login function');
            var email = formData.email;
            var password = formData.password;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    if (user.emailVerified) {
                        indexService.setUser(user.uid);
                        var getUsers = indexService.getUser();
                        var orderByChild = $scope.FBRef.orderByChild("email").equalTo(user.email).on("child_added", function (data) {
                            $rootScope.userRole = data.val();
                            api.setRole($rootScope.userRole)
                            vm.getRole = api.getUserRole();

                            switch (vm.getRole.userRole) {
                                case 'buyer':
                                    vm.gotoBuyer();
                                    $state.go('app.buyer.dashboard');
                                    break;
                                case 'seller':
                                    vm.gotoSeller();
                                    $state.go('app.seller.dashboard');
                                    break;
                                case 'admin':
                                    vm.gotoAdmin();
                                    break;
                                default:
                                    $state.go('app.pages_auth_login');
                                    break;
                            }
                        });
                    } else {

                        indexService.errorMessage('Email is not verified yet.please check you email')

                    }

                }, function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    if (errorCode == 'auth/weak-password') {
                        alert('The password is too weak.');
                    } else {
                        console.error(error);
                        indexService.errorMessage("Incorrect username or password");
                    }
                    // [END_EXCLUDE]
                });


        }


        // function to menu configuration
        function gotoBuyer() {

            msNavigationService.saveItem('apps.buyer', {
                title: 'buyer',
                icon: 'icon-cart',
                weight: 3
            });


            msNavigationService.saveItem('apps.buyer.dashboard', {
                title: 'Dashboard',
                state: 'app.buyer.dashboard'
            });

            $state.go('app.buyer.dashboard');

        }
        function gotoSeller() {

            console.log('gotoSeller')
            msNavigationService.saveItem('apps.seller', {
                title: 'seller',
                icon: 'icon-cart',
                weight: 2
            });
            msNavigationService.saveItem('apps.seller.dashboard', {
                title: 'Dashboard',
                state: 'app.seller.dashboard'
            });
            msNavigationService.saveItem('apps.seller.SellerCompany', {
                title: 'Company',
                state: 'app.seller.sellercompanies'
            });
            msNavigationService.saveItem('apps.seller.product', {
                title: 'Upload Products',
                state: 'app.seller.products'
            });
            $state.go('app.seller.dashboard');

        }
        function gotoAdmin() {
            // Navigation
            msNavigationService.saveItem('apps.admin', {
                title: 'admin',
                icon: 'icon-cart',
                weight: 1,
            });
            msNavigationService.saveItem('apps.admin.company', {
                title: 'Company Categories',
                state: 'app.admin.companies'
            });
            msNavigationService.saveItem('apps.admin.package', {
                title: 'User Role',
                state: 'app.admin.packages'
            });
            msNavigationService.saveItem('apps.admin.productCategory', {
                title: 'Prodcut Category',
                state: 'app.admin.productCategories'
            });

            // $state.go('app.seller.dashboard');
        }

    }
})();