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