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