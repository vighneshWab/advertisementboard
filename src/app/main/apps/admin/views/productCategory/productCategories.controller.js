(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductCategoriesController', ProductCategoriesController);

    /** @ngInject */
    function ProductCategoriesController($state, $scope, indexService) {
        var vm = this;

        $scope.FBref = firebase.database().ref('admin/productcategory');
        var list = indexService.getAll($scope.FBref).$loaded(function (success) {
            vm.productCategories = success;
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
                    width: '72px'
                },
                {
                    // Target the image column
                    targets: 1,
                    filterable: false,
                    sortable: true,
                    width: '80px'
                },
                {
                    // Target the image column
                    targets: 2,
                    filterable: false,
                    sortable: true,
                    width: '80px'
                },
                {
                    // Target the image column
                    targets: 3,
                    filterable: false,
                    sortable: false,
                    width: '80px'
                },
                {
                    // Target the image column
                    targets: 4,
                    filterable: false,
                    sortable: false,
                    width: '80px'
                },

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

        // Methods
        vm.gotoAddProductCategory = gotoAddProductCategory;
        vm.gotoProductCategoryDetail = function (id) {
            $state.go('app.admin.productCategories.detail', { id: id });
        };

        //////////

        /**
         * Go to add product
         */
        function gotoAddProductCategory() {
            $state.go('app.admin.productCategories.add');
        }


    }
})();