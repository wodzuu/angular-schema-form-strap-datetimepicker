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
      dateType: '@',
      startWeek: '@'
    },
    require: ['ngModel'],
    link: {
      pre: function(scope) {
        scope.dateFormat = scope.dateFormat || 'yyyy-MM-dd';
        scope.timeFormat = scope.timeFormat || 'HH:mm:ss';
        if (typeof(scope.showTimePicker) === 'undefined') {
          scope.showTimePicker = true;
        } else {
          scope.showTimePicker = scope.showTimePicker || (scope.showTimePicker === 'true');
        }
        scope.startOfDay = function(date) {
          if (!date) {
            return null;
          }
          if (date === 'today') {
            return date;
          }
          var dateStr = date.replace(/"/g, '');
          return new Date(dateStr).setHours(0, 0, 0, 0);
        };
      },
      post: function(scope, e, a, ctrls) {
        scope.$watch('minDate', function(v) {
          ctrls.filter(function(ctrl) {
            return ctrl.$validators.minDate;
          }).forEach(function(ctrl) {
            ctrl.$validate();
          });
        });

        ctrls.forEach(function(ctrl) {
          ctrl.$options = ctrl.$options || {}
          ctrl.$options.allowInvalid = true;
          ctrl.$validators.minDate = function(value) {
            if (!value || !scope.minDate) {
              return true;
            }
            var minDate = scope.minDate === 'today' ? new Date() : new Date(scope.minDate.replace(/"/g, ''));
            var valid = value.getTime() >= minDate.getTime();
            return valid;
          }
        });
      }
    }
  };
});

angular.module('schemaForm').config(['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider', 'sfBuilderProvider',
  function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider, sfBuilderProvider) {
    var datepicker = function(name, schema, options) {
      if (schema.type === 'string' && (schema.format === 'date-time' || schema.format === 'date')) {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key = options.path;
        f.type = 'datepicker';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.string.unshift(datepicker);

    schemaFormDecoratorsProvider.defineAddOn(
      'bootstrapDecorator',
      'datepicker',
      'templates/form-datepicker.html',
      sfBuilderProvider.stdBuilders
    );

  }
]);
angular.module("dateTimePicker").run(["$templateCache", function($templateCache) {$templateCache.put("templates/datetimepicker.html","<input \r\n	type=\"text\"\r\n	size=\"10\"\r\n	class=\"{{inputClass}}\"\r\n	placeholder=\"{{dateFormat}}\"\r\n	ng-required=\"ngRequired\"\r\n	ng-model=\"ngModel\"\r\n	ng-disabled=\"ngDisabled\"\r\n	data-date-type=\"{{dateType}}\"\r\n	data-min-date=\"{{startOfDay(minDate)}}\"\r\n	data-date-format=\"{{dateFormat}}\"\r\n	data-start-week=\"{{startWeek}}\"\r\n	data-autoclose=\"1\"\r\n	bs-datepicker\r\n>\r\n<input \r\n	type=\"text\"\r\n	size=\"8\"\r\n	class=\"{{inputClass}}\"\r\n	placeholder=\"{{timeFormat}}\"\r\n	ng-required=\"ngRequired\"\r\n	ng-model=\"ngModel\"\r\n	ng-show=\"{{showTimePicker}}\"\r\n	ng-disabled=\"ngDisabled\"\r\n	data-time-type=\"{{dateType}}\"\r\n	data-time-format=\"{{timeFormat}}\"\r\n	data-autoclose=\"1\"\r\n	bs-timepicker\r\n>");}]);
angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("templates/form-datepicker.html","<div class=\"form-group {{form.htmlClass}} datetimepicker\" ng-class=\"{\'has-error\': hasError()}\">\r\n	<label class=\"control-label\" ng-show=\"showTitle()\">\r\n		<i class=\"fa fa-calendar\"></i>\r\n		{{form.title}}\r\n	</label>\r\n	<br/>\r\n	<date-time-picker\r\n		schema-validate=\"form\"\r\n		name=\"{{form.key.slice(-1)[0]}}\"\r\n		sf-field-model\r\n		date-format=\"yyyy-MM-dd\"\r\n		time-format=\"HH:mm:ss\"\r\n		show-time-picker=\"{{form.schema.format === \'date-time\'}}\"\r\n		input-class=\"form-control\"\r\n		class=\"datetimepicker\"\r\n		start-week=\"{{options.formDefaults.startWeek || 0}}\"\r\n		date-type=\"iso\">\r\n	</date-time-picker>\r\n	<div\r\n		class=\"help-block\"\r\n		ng-show=\"(hasError() && errorMessage(schemaError())) || form.description\"\r\n		ng-bind-html=\"(hasError() && errorMessage(schemaError())) || form.description\">\r\n	</div>\r\n</div>");}]);