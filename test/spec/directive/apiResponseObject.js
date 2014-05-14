'use strict';

describe('Directive: apiResponseObject', function () {

  // load the directive's module
  beforeEach(module('dashbenchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<api-response-object></api-response-object>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the apiResponseObject directive');
  }));
});
