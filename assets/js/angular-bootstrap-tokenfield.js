(function () {
    'use strict';

    // Register module
    var myModule = angular.module('angularTokenfield', []);

    // Define directive
    myModule.directive ('angularBootstrapTokenfield', function() {
        return {
            restrict: 'A',
            scope: {
                'tokens': '=tokens',
                'limit': '=limit',
                'minLength': '=minLength',
                'minWidth': '=minWidth',
                'showAutocompleteOnFocus': '=showAutocompleteOnFocus',
                'autocomplete': '=autocomplete',
                'createTokensOnBlur': '=createTokensOnBlur',
                'delimiter': '=delimiter',
                'beautify': '=beautify',
                'inputType': '=inputType'
            },
            link: function(scope, element, attrs) {
                element.tokenfield(scope)[0];
                scope.original = element[0]
                scope.tokenInput = element.siblings('.token-input')[0];
                scope.tokenInput.placeholder = '';
                scope.$watch(function(){
                    scope.tokenInput.placeholder = scope.original.placeholder;
                });
            }
        }
    });
})();
