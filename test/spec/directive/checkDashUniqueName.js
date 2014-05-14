'use strict';

describe('Directive: checkDashUniqueName', function () {

  // load the directive's module
  beforeEach(module('dashbenchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<check-dash-unique-name></check-dash-unique-name>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the checkDashUniqueName directive');
  }));
});
