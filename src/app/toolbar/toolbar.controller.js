(function () {
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, $q, $state, $scope, indexService, $timeout, $mdSidenav, $translate, $mdToast, msNavigationService) {
        var vm = this;

        // Data
        $rootScope.global = {
            search: ''
        };

        vm.bodyEl = angular.element('body');
        var getUsers = indexService.getUser();
        vm.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        vm.languages = {
            en: {
                'title': 'English',
                'translation': 'TOOLBAR.ENGLISH',
                'code': 'en',
                'flag': 'us'
            },
            es: {
                'title': 'Spanish',
                'translation': 'TOOLBAR.SPANISH',
                'code': 'es',
                'flag': 'es'
            },
            tr: {
                'title': 'Turkish',
                'translation': 'TOOLBAR.TURKISH',
                'code': 'tr',
                'flag': 'tr'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
        vm.search = search;
        vm.searchResultClick = searchResultClick;
        vm.becomeSeller = becomeSeller;
        vm.now = Date.now();
        vm.expirydate = Date.now();
        vm.getUserRole = getUserRole;
        // vm.expirydate.setDate(vm.expirydate.getDate() + 15);

        $scope.FBref = firebase.database().ref('seller/transation');
        $scope.UserProfile = firebase.database().ref('usersProfile')



        function getUserRole() {

            indexService.haveingUid('usersProfile').then(function (res) {
                if (res.isArray) {
                
                    vm.userRole = res[0].userRole;
                }
            })

        }




        //////////

        init();

        /**
         * Initialize
         */
        function init() {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];

            // Get the selected language directly from angular-translate module setting
            vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
        }


        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status) {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout() {
            // Do logout here..
        }

        /**
         * Change Language
         */
        function changeLanguage(lang) {
            vm.selectedLanguage = lang;

            /**
             * Show temporary message if user selects a language other than English
             *
             * angular-translate module will try to load language specific json files
             * as soon as you change the language. And because we don't have them, there
             * will be a lot of errors in the page potentially breaking couple functions
             * of the template.
             *
             * To prevent that from happening, we added a simple "return;" statement at the
             * end of this if block. If you have all the translation files, remove this if
             * block and the translations should work without any problems.
             */
            if (lang.code !== 'en') {
                var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';

                $mdToast.show({
                    template: '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                    hideDelay: 7000,
                    position: 'top right',
                    parent: '#content'
                });

                return;
            }

            // Change the language
            $translate.use(lang.code);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu() {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }

        /**
         * Toggle msNavigation folded
         */
        function toggleMsNavigationFolded() {
            msNavigationService.toggleFolded();
        }

        /**
         * Search action
         *
         * @param query
         * @returns {Promise}
         */
        function search(query) {
            var navigation = [],
                flatNavigation = msNavigationService.getFlatNavigation(),
                deferred = $q.defer();

            // Iterate through the navigation array and
            // make sure it doesn't have any groups or
            // none ui-sref items
            for (var x = 0; x < flatNavigation.length; x++) {
                if (flatNavigation[x].uisref) {
                    navigation.push(flatNavigation[x]);
                }
            }

            // If there is a query, filter the navigation;
            // otherwise we will return the entire navigation
            // list. Not exactly a good thing to do but it's
            // for demo purposes.
            if (query) {
                navigation = navigation.filter(function (item) {
                    if (angular.lowercase(item.title).search(angular.lowercase(query)) > -1) {
                        return true;
                    }
                });
            }

            // Fake service delay
            $timeout(function () {
                deferred.resolve(navigation);
            }, 1000);

            return deferred.promise;
        }

        /**
         * Search result click action
         *
         * @param item
         */
        function searchResultClick(item) {
            // If item has a link
            if (item.uisref) {
                // If there are state params,
                // use them...
                if (item.stateParams) {
                    $state.go(item.state, item.stateParams);
                }
                else {
                    $state.go(item.state);
                }
            }
        }

        $scope.userRoles = 'admin/userRoles';
     

        vm.create = function (createObject) {
            console.log('Create', JSON.stringify(createObject))
            indexService.createTransaction($scope.FBref, createObject).then(function (res) {
                console.log(res)
                if (res) {
                    vm.updateUserRole();
                } else {
                    indexService.errorMessage('error while become a seller');

                }


            });



            // vm.updateUserRole();

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

        function becomeSeller() {
            console.log('become seller');
            var list = indexService.getTrialPackage($scope.userRoles).then(function (success) {
                vm.trialPackage = success;
                console.log('trial trialPackage:', JSON.stringify(vm.trialPackage))

                if (Array.isArray(vm.trialPackage)) {
                    vm.formData = {
                        uid: getUsers,
                        packageId: vm.trialPackage[0].$id,
                        MaxCompanyCount: vm.trialPackage[0].MaxCompanyCount,
                        MaxProductCount: vm.trialPackage[0].MaxProductCount,
                        MaxSellCount: vm.trialPackage[0].MaxSellCount,
                        purchaseDate: indexService.createdDate,
                        expirydate: indexService.expireDate15
                    }
                    vm.create(vm.formData);
                }



            });







        }
    }

})();