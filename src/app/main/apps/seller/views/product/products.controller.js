(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('ProductsController', ProductsController);

    /** @ngInject */
    function ProductsController($state, $scope, indexService) {
        var vm = this;

        $scope.FBref = firebase.database().ref('seller/product');
        var list = indexService.haveingUid('seller/product').then(function (success) {
            vm.products = success;
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
                    // width: '80px'
                },
                {
                    // Target the image column
                    targets: 2,
                    filterable: false,
                    sortable: true,
                    // width: '80px'
                },
                {
                    // Target the image column
                    targets: 3,
                    filterable: false,
                    sortable: true,
                    // width: '80px'
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

        // Methods
        vm.gotoAddProduct = gotoAddProduct;
        vm.gotoProduct = gotoProduct;
        function gotoProduct(id) {
            $state.go('app.seller.products.detail', { id: id });
        };

        //////////

        /**
         * Go to add product
         */
        function gotoAddProduct() {
            $state.go('app.seller.products.add');
        }


    }
})();