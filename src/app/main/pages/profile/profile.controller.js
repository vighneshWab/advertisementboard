(function () {
    'use strict';

    angular
        .module('app.pages.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController(indexService, $scope, api) {
        var vm = this;

        // data start
        vm.user = {};
        vm.updateProfile = updateProfile; // save profile  
        vm.isFormValid = isFormValid;  // form validation
        $scope.Fref = firebase.database().ref('/usersProfile');
        var getUsers = indexService.getUser();


        // Data ends


        // Methods
        var list = indexService.haveingUid('usersProfile').then(function (success) {
            vm.user = success[0];
            delete vm.user.$id;
            delete vm.user.$priority;
            console.log(JSON.stringify(vm.user))
        });

        function updateProfile() {
            // indexService.update('usersProfile', vm.user.uid, vm.user).then(function (res) {
            //     console.log(res)

            // })
            var orderByChild = $scope.Fref.orderByChild("uid").equalTo(getUsers).on("child_added", function (data) {
                var obj = data.val();
                console.log(JSON.stringify(obj))


                indexService.update($scope.Fref, data.key, vm.user).then(function (res) {
                    console.log('response:', res)


                })
            });

        }

        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }






        //////////
    }

})();
