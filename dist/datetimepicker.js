'use strict';

angular.module('dateTimePicker', ['mgcrea.ngStrap.timepicker', 'mgcrea.ngStrap.datepicker']).directive('dateTimePicker', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/datetimepicker.html',
		scope: {
			ngModel: '=',
			dateFormat: '@',
			showTimePicker: '@',
			timeFormat: '@',
			inputClass: '@',
			ngDisabled: '=',
			ngRequired: '=',
			minDate: '@',
			dateType: '@'
		},
		require: ['ngModel'],
		link: {
			pre: function(scope){
				scope.dateFormat = scope.dateFormat || 'yyyy-MM-dd';
				scope.timeFormat = scope.timeFormat || 'HH:mm:ss';
				if(typeof(scope.showTimePicker) === 'undefined'){
					scope.showTimePicker = true;
				} else {
					scope.showTimePicker = scope.showTimePicker || (scope.showTimePicker === 'true');
				}
			}
		}
	}
});

angular.module('schemaForm').config(['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
	function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {
		var datepicker = function(name, schema, options) {
			if (schema.type === 'string' && (schema.format === 'date-time' || schema.format === 'date')) {
				var f = schemaFormProvider.stdFormObj(name, schema, options);
				f.key  = options.path;
				f.type = 'datepicker';
				options.lookup[sfPathProvider.stringify(options.path)] = f;
				return f;
			}
		};

		schemaFormProvider.defaults.string.unshift(datepicker);

		schemaFormDecoratorsProvider.addMapping(
			'bootstrapDecorator',
			'datepicker',
			'templates/form-datepicker.html'
		);

	}
]);
angular.module("dateTimePicker").run(["$templateCache", function($templateCache) {$templateCache.put("templates/datetimepicker.html","<input \n	type=\"text\"\n	size=\"10\"\n	class=\"{{inputClass}}\"\n	placeholder=\"{{dateFormat}}\"\n	ng-required=\"ngRequired\"\n	ng-model=\"ngModel\"\n	ng-disabled=\"ngDisabled\"\n	data-date-type=\"{{dateType}}\"\n	data-min-date=\"{{minDate}}\"\n	data-date-format=\"{{dateFormat}}\"\n	data-autoclose=\"1\"\n	bs-datepicker\n>\n<input \n	type=\"text\"\n	size=\"8\"\n	class=\"{{inputClass}}\"\n	placeholder=\"{{timeFormat}}\"\n	ng-required=\"ngRequired\"\n	ng-model=\"ngModel\"\n	ng-show=\"{{showTimePicker}}\"\n	ng-disabled=\"ngDisabled\"\n	data-time-type=\"{{dateType}}\"\n	data-time-format=\"{{timeFormat}}\"\n	data-autoclose=\"1\"\n	bs-timepicker\n>");}]);
angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("templates/form-datepicker.html","<div class=\"form-group {{form.htmlClass}} datetimepicker\" ng-class=\"{\'has-error\': hasError()}\">\n	<label class=\"control-label\" ng-show=\"showTitle()\">\n		<i class=\"fa fa-calendar\"></i>\n		{{form.title}}\n	</label>\n	<br/>\n	<date-time-picker \n		schema-validate=\"form\"\n		name=\"{{form.key.slice(-1)[0]}}\"\n		ng-model=\"$$value$$\"\n		date-format=\"yyyy-MM-dd\"\n		time-format=\"HH:mm:ss\"\n		show-time-picker=\"{{form.schema.format === \'date-time\'}}\"\n		input-class=\"form-control\"\n		class=\"datetimepicker\"\n		date-type=\"iso\">\n	</date-time-picker>\n	<div \n		class=\"help-block\"\n		ng-show=\"(hasError() && errorMessage(schemaError())) || form.description\"\n		ng-bind-html=\"(hasError() && errorMessage(schemaError())) || form.description\">\n	</div>\n</div>");}]);