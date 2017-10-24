(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminUsersController', AdminUsersController);

    /** @ngInject */
    function AdminUsersController(indexService, $scope, api, $q, $state, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        console.log('AdminUsersController');
        var vm = this;
        vm.gotoUsers = gotoUsers;
        var list = api.getAll('user').then(function (success) {
            vm.users = success;
            console.log(JSON.stringify(vm.users));
        }, function (error) {
        });


        vm.dtInstance = {};
        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs: [
                {
                    // Target the id column
                    targets: 0,
                    width: '72px',
                    filterable: false,
                    sortable: false,
                },
                {
                    // Target the image column
                    targets: 1,
                    filterable: false,
                    sortable: true,

                },
                {
                    // Target the image column
                    targets: 2,
                    filterable: false,
                    sortable: true,

                },
                {
                    // Target the image column
                    targets: 3,
                    filterable: false,
                    sortable: true,

                },
                {
                    // Target the actions column
                    targets: 4,
                    responsivePriority: 1,
                    filterable: false,
                    sortable: true
                }
            ],
            initComplete: function () {
                var api = this.api(),
                    searchBox = angular.element('body').find('#e-commerce-products-search');

                // Bind an external input as a table wide search box
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType: 'simple',
            lengthMenu: [10, 20, 30, 50, 100],
            pageLength: 20,
            scrollY: 'auto',
            responsive: true
        };
        function gotoUsers(userId, key) {
            console.log(user)
        }





    }
})();