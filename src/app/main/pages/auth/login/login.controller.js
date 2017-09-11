(function () {
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(indexService, $scope, $state) {
        // Data
        var vm = this;
        var todayis = Date.now();

        console.log('todayis', todayis);

        var today=new Date()

        console.log('Today in date',today.toDateString() )


        var addNoDaysinMilSec = 1000 * 60 * 60 * 24 * 15;



        var tomarrowWill = todayis + addNoDaysinMilSec;
         var tomarrow=new Date(tomarrowWill)

        console.log('tomarrowWill', tomarrowWill);
        console.log('tomarrow in date',tomarrow.toDateString() )
        





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
                            $scope.userRole = data.val().userRole;
                            console.log(JSON.stringify($scope.userRole));
                            switch ($scope.userRole) {
                                case 'buyer':
                                    // redirect to  buyer dashboard once advertisment board is designed
                                    $state.go('app.admin.companies');
                                    break;
                                case 'seller':
                                    // redirect to  seller dashboard once advertisment board is designed
                                    $state.go('app.admin.companies');
                                    break;
                                case 'admin':
                                    // redirect to  admin dashboard once advertisment board is designed
                                    $state.go('app.admin.companies');
                                    break;
                            }
                        });
                    } else {
                        $state.go('app.pages_coming-soon');
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
                    }
                    // [END_EXCLUDE]
                });

        }

        //////////
    }
})();