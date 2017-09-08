(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('SellerCompaniesController', SellerCompaniesController);

    /** @ngInject */
    function SellerCompaniesController($state, $scope,indexService ) {
        var vm = this;

        $scope.FBref = firebase.database().ref('seller/company')
        var list = indexService.getAll($scope.FBref).$loaded(function (success) {
            vm.sellerCompanies = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });

       
        // Methods
        vm.gotoAddCompany = gotoAddCompany;
        vm.gotoCompanyDetail = gotoCompanyDetail;

        //////////

        /**
         * Go to add product
         */
        function gotoAddCompany() {
            console.log('company:gotoAddProduct')
            $state.go('app.seller.sellercompanies.SellerCompany');
        }

        /**
         * Go to product detail
         *
         * @param id
         */
        function gotoCompanyDetail(id) {
            $state.go('app.seller.sellercompanies.detail', { id: id });
        }
    }
})();