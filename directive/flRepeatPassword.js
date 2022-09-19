'use strict';

angular.module('flValidation')
  // jshint ignore:start
  /**
  * @ngdoc directive
  * @name flValidation.directive:flRepeatPassword
  * @element input
  * @function
  *
  * @description
  * Validator confirming that a second input matches a first one. Useful for
  * Password Confirm inputs.
  *
  * @usage
  * <!-- Pass the name of the first input to the directive -->
  * <form name="form">
  *   <input type="text" name="password" ng-model="user.password">
  *   <input type="text" name="confirmPassword" ng-model="confirmPassword" fl-repeat-password="password">
  *   <div ng-messages="form.confirmPassword.$error">
  *     <span ng-message="repeat">
  *       The passwords don't match!
  *     </span>
  *   </div>
  * </form>
  */
  // jshint ignore:end
  .directive('flRepeatPassword', function() {
    return {
      require: ['ngModel', '^form'],
      link: function postLink(scope, elem, attrs, ctrls) {
        // The "password" field
        var ctrl = ctrls[0];
        var originalInput = ctrls[1][attrs.flRepeatPassword];
        ctrl.$validators.repeat = function(value) {
          return value === originalInput.$viewValue;
        };
        originalInput.$parsers.push(function(value) {
          // Unvalid the repeat field in the original field
          // has changed
          ctrl.$setValidity('repeat', value === ctrl.$viewValue);
          // Always return the value since it's the orignal
          // input one
          return value;
        });
      }
    };
  });
