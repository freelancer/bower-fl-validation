'use strict';

angular.module('flValidation')
  // jshint ignore:start
  /**
  * @ngdoc directive
  * @name flValidation.directive:flInvalidIf
  * @element input
  * @function
  *
  * @description
  * Validator watching an Angular expression and setting an "flInvalidIf"
  * $error key if the expression evals to "true". Useful in your form when you
  * have external validation rules, e.g. a negative response from the service,
  * and you want a form input to reflect that state (with ng-invalid class and
  * the like).
  *
  * @usage
  * <form name="form">
  *   <input type="text" name="title" ng-model="project.title"
        fl-invalid-if="{duplicateProject: error.dupplicateProject,
                        anotherError: anotherCondition}">
  *   <div ng-messages="form.title.$error">
  *     <span class="validation-info" ng-message="duplicateProject">
  *       Duplicate project, please pick another title
  *     </span>
        <span class="validation-info" ng-message="anotherError">
  *       Another condition evaluates to false, fix it
  *     </span>
  *   </div>
  * </form>
  */
  // jshint ignore:end
  .directive('flInvalidIf', function($log) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {

        scope.$watch(attrs.flInvalidIf, function(newVal) {
          /**
          * In order to make the directive backwards-compatible we now check
          * the type of the supplied attribute. If it's an object we use the
          * new behaviour, otherwise we use the old one (and warn the user).
          */
          if(angular.isObject(newVal)) {
            angular.forEach(newVal, function(value, key) {
              ctrl.$setValidity(key, !value);
            });
          } else {
            $log.warn('This usage is deprecated. You should use ' +
              'fl-invalid-if="{name: condition [, name2: condition2]}"');
            ctrl.$setValidity('flInvalidIf', !newVal);
          }
        });

      }
    };
  });
