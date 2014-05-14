'use strict';

describe('Directive: dashPreview', function () {

  // load the directive's module
  beforeEach(module('dashbenchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dash-preview></dash-preview>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dashPreview directive');
  }));
});
