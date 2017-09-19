(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, indexService, msNavigationService, $rootScope) {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;


        // vm.getRole = indexService.getUserRole();
        // vm.gotoBuyer = gotoBuyer;
        // vm.gotoSeller = gotoSeller;
        // vm.gotoAdmin = gotoAdmin;
        // console.log(vm.getRole);



        // switch (vm.getRole) {

        //     case 'buyer':

        //         vm.gotoBuyer();

        //         break;

        //     case 'seller':

        //         vm.gotoSeller()

        //         break;

        //     case 'admin':

        //         vm.gotoAdmin()

        //         break;



        // }
        // function gotoBuyer() {


        // }
        // function gotoSeller() {

        //     msNavigationService.saveItem('apps.seller', {
        //         title: 'seller',
        //         icon: 'icon-cart',
        //         weight: 2
        //     });


        //     msNavigationService.saveItem('apps.seller.dashboard', {
        //         title: 'Dashboard',
        //         state: 'app.seller.dashboard'
        //     });
        //     msNavigationService.saveItem('apps.seller.SellerCompany', {
        //         title: 'Company',
        //         state: 'app.seller.sellercompanies'
        //     });
        //     msNavigationService.saveItem('apps.seller.product', {
        //         title: 'Upload Products',
        //         state: 'app.seller.products'
        //     });


        // }



        // function gotoAdmin() {

        //     // Navigation
        //     msNavigationService.saveItem('apps.admin', {
        //         title: 'admin',
        //         icon: 'icon-cart',
        //         weight: 1,

        //     });

        //     msNavigationService.saveItem('apps.admin.company', {
        //         title: 'Company Categories',
        //         state: 'app.admin.companies'
        //     });
        //     msNavigationService.saveItem('apps.admin.package', {
        //         title: 'User Role',
        //         state: 'app.admin.packages'
        //     });
        //     msNavigationService.saveItem('apps.admin.productCategory', {
        //         title: 'Prodcut Category',
        //         state: 'app.admin.productCategories'
        //     });


        // }









        //////////
    }
})();