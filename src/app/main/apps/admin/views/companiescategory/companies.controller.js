(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('CompaniesController', CompaniesController);

    /** @ngInject */
    function CompaniesController($state, $scope, indexService) {
        var vm = this;
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
                    sortable: false,

                },
                {
                    // Target the actions column
                    targets: 4,
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
            lengthMenu: [10, 20, 30, 50, 100],
            pageLength: 20,
            scrollY: 'auto',
            responsive: true
        };

        $scope.FBref = firebase.database().ref('admin/companycategory');
        var list = indexService.getAll($scope.FBref).$loaded(function (success) {
            vm.companyCategories = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });



        // Methods
        vm.gotoAddCategory = gotoAddCategory;
        vm.gotoProductDetail = gotoProductDetail;

        //////////

        /**
         * Go to add product
         */
        function gotoAddCategory() {
            $state.go('app.admin.companies.category');
        }

        /**
         * Go to product detail
         *
         * @param id
         */
        function gotoProductDetail(id) {
            $state.go('app.admin.companies.detail', { id: id });
        }
    }
})();