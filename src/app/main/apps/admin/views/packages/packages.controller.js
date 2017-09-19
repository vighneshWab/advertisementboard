(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('PackagesController', PackagesController);

    /** @ngInject */
    function PackagesController($state, $scope, indexService) {
        var vm = this;
        $scope.FBref = firebase.database().ref('admin/userRoles');
        var list = indexService.getAll($scope.FBref).$loaded(function (success) {
            vm.packages = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

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
                    width: '80px'
                },
                {
                    // Target the price column
                    targets: 4,
                    filterable: false,
                    sortable: true,
                    width: '80px'

                },
                {
                    // Target the quantity column
                    targets: 5,
                    filterable: false,
                    sortable: true,
                    width: '80px'

                },
                {
                    // Target the status column
                    targets: 6,
                    filterable: false,
                    sortable: true,
                    width: '80px'

                },
                {
                    // Target the actions column
                    targets: 7,
                    responsivePriority: 1,
                    filterable: false,
                    sortable: false
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
            lengthMenu: [5, 10, 20, 30, 50, 100],
            pageLength: 5,
            scrollY: 'auto',
            responsive: true
        };

        // Methods
        vm.gotoAddPackage = gotoAddPackage;
        vm.gotoPackageDetail = gotoPackageDetail;

        //////////

        /**
         * Go to add product
         */
        function gotoAddPackage() {
            $state.go('app.admin.packages.add');
        }

        /**
         * Go to product detail
         *
         * @param id
         */
        function gotoPackageDetail(id) {
            $state.go('app.admin.packages.detail', { id: id });
        }

    }
})();