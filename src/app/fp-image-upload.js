var app = angular.module('fuse');
app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

app.directive('filelistBind', function () {
	return function (scope, elm, attrs) {
		elm.bind('change', function (evt) {
			scope.$apply(function () {
				scope[attrs.name] = evt.target.files;
				scope.imgAvailable = true;
				//renderImage(evt.target.files[0]);
				// generate a new FileReader object
				var reader = new FileReader();
				// inject an image with the src url
				reader.onload = function (event) {
					scope.$apply(function () {
						scope.the_url = event.target.result
					});
				};
				// when the file is read it triggers the onload event above.
				reader.readAsDataURL(evt.target.files[0]);
			});
		});
	};
});


