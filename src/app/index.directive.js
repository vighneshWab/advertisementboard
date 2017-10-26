(function () {
    'use strict';

    angular
        .module('fuse')
        .directive('abn', abnAvailabilityasyncValidators)
        .directive('uniqueName', uniqueName)
        .directive('uniqueEmail', uniqueEmail)
        .directive('numbersOnly', numbersOnly)
        .directive("limitTo", limitTo)
        .directive("companyDetails", companyDetails)
        .directive('compareTo', compareTo)
        .filter('capitalize', function () {
            return function (input) {
                return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
            }
        });

    function uniqueEmail($timeout, api) {
        console.log('uniqueEmail')
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, el, attrs, ctrl) {
                ctrl.$parsers.push(function (viewValue) {
                    if (viewValue) {
                        console.log('viewvalue:', viewValue)
                        var email = viewValue;
                        var pattern = /^.+@.+\..+$/;
                        if (pattern.test(email)) {
                            $timeout(function () {
                                api.verifyEmail(email).then(function (success) {
                                    console.log('verifyEmail');
                                    var data = success[0];
                                    console.log(data)
                                    if (data == undefined) {
                                        ctrl.$setValidity('uniqueEmail', true);
                                    } else {

                                        // if (data.uid == false) {
                                        //     ctrl.$setValidity('uniqueEmail', true);
                                        // } else {
                                        //     // deferred.reject();
                                        //     ctrl.$setValidity('uniqueEmail', false);
                                        // }
                                        ctrl.$setValidity('uniqueEmail', false);

                                    }
                                })
                            }, 200)
                        }
                        return viewValue;
                    }
                });
            }
        };
    }

    function abnAvailabilityasyncValidators(api, $q, $rootScope, $timeout) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                // ngModel.$viewChangeListeners.push(function () {
                ngModel.$asyncValidators.abnValidator = function (modelvalue, viewvalue) {
                    var deferred = $q.defer();
                    var abn = modelvalue;
                    if (abn.length == 11) {
                        api.verifyABN(abn).then(function (success) {
                            var data = success[0];
                            console.log(data)
                            if (data == undefined) {
                                deferred.resolve();
                            } else {
                                // if (data.uid == false) {
                                //     deferred.resolve();
                                // } else {
                                //     deferred.reject();
                                // }
                                deferred.reject();
                            }

                        })

                    }
                    return deferred.promise;
                }
                // });


            }
        }
    }



    function uniqueName($timeout, api) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, el, attrs, ctrl) {


                ctrl.$viewChangeListeners.push(function () {
                    console.log(ctrl.$modelValue);

                    ctrl.$parsers.push(function (viewValue) {
                        if (viewValue) {
                            var email = viewValue;
                            if (email) {
                                $timeout(function () {
                                    api.verifyName(email).then(function (success) {
                                        var data = success[0];
                                        console.log(data)
                                        if (data == undefined) {
                                            ctrl.$setValidity('uniqueName', true);
                                        } else {
                                            ctrl.$setValidity('uniqueName', false);

                                        }
                                    })
                                }, 200)
                            }
                            return viewValue;
                        }
                    });
                });



            }
        };
    }





    function numbersOnly() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    }


    function limitTo() {

        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                console.log('limitto');
                var limit = parseInt(attrs.limitTo);
                angular.element(elem).on("keypress", function (e) {
                    if (this.value.length == limit) {
                        console.log('length matched')
                        e.preventDefault();
                    }
                });
            }
        }
    }


    function companyDetails() {


    }


    function compareTo() {

        return {
            // require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                // ngModel.$validators.compareTo = function (modelValue) {
                //     return modelValue == scope.otherModelValue;
                // };

                // scope.$watch("otherModelValue", function () {
                //     ngModel.$validate();
                // });
            }
        };


    }


})();