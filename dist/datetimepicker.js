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

angular.module('schemaForm').config(['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
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

    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'datepicker',
      'templates/form-datepicker.html'
    );

  }
]);
angular.module("dateTimePicker").run(["$templateCache", function($templateCache) {$templateCache.put("templates/datetimepicker.html","<input \n	type=\"text\"\n	size=\"10\"\n	class=\"{{inputClass}}\"\n	placeholder=\"{{dateFormat}}\"\n	ng-required=\"ngRequired\"\n	ng-model=\"ngModel\"\n	ng-disabled=\"ngDisabled\"\n	data-date-type=\"{{dateType}}\"\n	data-min-date=\"{{startOfDay(minDate)}}\"\n	data-date-format=\"{{dateFormat}}\"\n	data-start-week=\"{{startWeek}}\"\n	data-autoclose=\"1\"\n	bs-datepicker\n>\n<input \n	type=\"text\"\n	size=\"8\"\n	class=\"{{inputClass}}\"\n	placeholder=\"{{timeFormat}}\"\n	ng-required=\"ngRequired\"\n	ng-model=\"ngModel\"\n	ng-show=\"{{showTimePicker}}\"\n	ng-disabled=\"ngDisabled\"\n	data-time-type=\"{{dateType}}\"\n	data-time-format=\"{{timeFormat}}\"\n	data-autoclose=\"1\"\n	bs-timepicker\n>");}]);
angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("templates/form-datepicker.html","<div class=\"form-group {{form.htmlClass}} datetimepicker\" ng-class=\"{\'has-error\': hasError()}\">\n	<label class=\"control-label\" ng-show=\"showTitle()\">\n		<i class=\"fa fa-calendar\"></i>\n		{{form.title}}\n	</label>\n	<br/>\n	<date-time-picker\n		schema-validate=\"form\"\n		name=\"{{form.key.slice(-1)[0]}}\"\n		ng-model=\"$$value$$\"\n		date-format=\"yyyy-MM-dd\"\n		time-format=\"HH:mm:ss\"\n		show-time-picker=\"{{form.schema.format === \'date-time\'}}\"\n		input-class=\"form-control\"\n		class=\"datetimepicker\"\n		start-week=\"{{options.formDefaults.startWeek || 0}}\"\n		date-type=\"iso\">\n	</date-time-picker>\n	<div \n		class=\"help-block\"\n		ng-show=\"(hasError() && errorMessage(schemaError())) || form.description\"\n		ng-bind-html=\"(hasError() && errorMessage(schemaError())) || form.description\">\n	</div>\n</div>");}]);