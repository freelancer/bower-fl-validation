'use strict';

angular.module('flValidation')
  // jshint ignore:start
  /**
  * @ngdoc directive
  * @name flValidation.directive:flDifferentFrom
  * @element input
  * @function
  *
  * @description
  * Validator ensuring that an input field is different from another one (a
  * password should be different than the username for instance). Sets a
  * "different" $error key when the two fields are not different.
  *
  * @usage
  * <!-- Pass the name of the other input to the directive -->
  * <form name="form">
  *   <input type="text" name="username" ng-model="user.username">
  *   <input type="text" name="password" ng-model="user.password" fl-different-from="username">
  *   <div ng-messages="form.password.$error">
  *     <span ng-message="different">
  *       Your password must be different than your username
  *     </span>
  *   </div>
  * </form>
  */
  // jshint ignore:end
  .directive('flDifferentFrom', function() {
    return {
      require: ['ngModel', '^form'],
      link: function postLink(scope, elem, attrs, ctrls) {
        var input = ctrls[0];
        var otherInput = ctrls[1][attrs.flDifferentFrom];
        input.$validators.different = function(value) {
          return value !== otherInput.$viewValue;
        };
        otherInput.$parsers.push(function(value) {
          // Unvalid the field in the other field
          // has changed
          input.$setValidity('different', value !== input.$viewValue);
          // Always return the value since it's the other
          // input one
          return value;
        });
      }
    };
  });
