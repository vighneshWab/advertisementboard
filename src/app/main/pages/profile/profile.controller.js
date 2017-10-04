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
        // var list = api.getUserData('user', getUsers).then(function (success) {
        //     vm.user = success[0];

        //     console.log(JSON.stringify(vm.user))
        // });

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

        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }






        //////////
    }

})();
