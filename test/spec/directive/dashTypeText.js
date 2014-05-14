'use strict';

describe('Directive: dashTypeText', function () {

  // load the directive's module
  beforeEach(module('dashbenchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dash-type-text></dash-type-text>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dashTypeText directive');
  }));
});
