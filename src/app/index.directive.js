(function () {
    'use strict';

    angular
        .module('fuse')
        .directive('abn', abnAvailabilityasyncValidators)
        .directive('emailval', emailAvailabilityValidator);

    function abnAvailabilityasyncValidators(api, $q, $timeout) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {

                ngModel.$asyncValidators.abnValidator = function (modelvalue, viewvalue) {
                    var deferred = $q.defer();
                    var abn = modelvalue;
                    if (abn.length == 11) {
                        $timeout(function () {
                            api.verifyABN(abn).then(function (success) {
                                var data = success[0];
                                console.log(data)
                                if (data == undefined) {
                                    deferred.resolve();
                                } else {
                                    deferred.reject();

                                }
                            })
                        }, 500)
                    }
                    return deferred.promise;
                }
            }
        }
    }

    function emailAvailabilityValidator(api, $timeout, $q) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$validators.emailValidator = function (modelvalue, viewvalue) {
                    var deferred = $q.defer();
                    var email = modelvalue;
                    var pattern = /^.+@.+\..+$/;
                    if (pattern.test(email)) {
                        $timeout(function () {
                            api.verifyEmail(email).then(function (success) {
                                var data = success[0];
                                console.log(data)
                                if (data == undefined) {
                                    deferred.resolve();
                                } else {
                                deferred.reject();

                                }
                            })
                        }, 500)
                    }
                    return deferred.promise;
                }
            }
        }



    }

})();