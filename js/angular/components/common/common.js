(function() {
  'use strict';

  angular.module('foundation.common', ['foundation.core'])
    .directive('zfClose', zfClose)
    .directive('zfClosable', zfClosable)
    .directive('zfOpen', zfOpen)
    .directive('zfToggle', zfToggle)
    .directive('zfEscClose', zfEscClose)
    .directive('zfSwipeClose', zfSwipeClose)
    .directive('zfHardToggle', zfHardToggle)
  ;

  zfClose.$inject = ['FoundationApi'];

  function zfClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        e.preventDefault();
        if (attrs.zfClose) {
          var targetId = attrs.zfClose;  
          foundation.publish(targetId, 'close');
        } else {
          scope.$emit('zf-close');
        }
      });
    }
  }
  
  zfClosable.$inject = ['FoundationApi'];
  
  function zfClosable(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };
    
    return directive;
  
    function link(scope, element, attrs) {
      var id = attrs.id;
      
      scope.$on('zf-close', function(e, data) {
        if (scope.active === false) return;
        if (data && data.exclude === id) return;
        if (e.stopPropagation) e.stopPropagation();
        foundationApi.publish(id, 'close');
      });
    }
  }

  zfOpen.$inject = ['FoundationApi'];

  function zfOpen(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfOpen, 'open');
        e.preventDefault();
      });
    }
  }

  zfToggle.$inject = ['FoundationApi'];

  function zfToggle(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    }

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfToggle, 'toggle');
        e.preventDefault();
      });
    }
  }

  zfEscClose.$inject = ['FoundationApi'];

  function zfEscClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('keyup', function(e) {
        if (e.keyCode === 27) {
          foundationApi.closeActiveElements();
        }
        e.preventDefault();
      });
    }
  }

  zfSwipeClose.$inject = ['FoundationApi'];

  function zfSwipeClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;

    function link($scope, element, attrs) {
      var swipeDirection;
      var hammerElem;
      if (Hammer) {
        hammerElem = new Hammer(element[0]);
        // set the options for swipe (to make them a bit more forgiving in detection)
        hammerElem.get('swipe').set({
          direction: Hammer.DIRECTION_ALL,
          threshold: 5, // this is how far the swipe has to travel
          velocity: 0.5 // and this is how fast the swipe must travel
        });
      }
      // detect what direction the directive is pointing
      switch (attrs.zfSwipeClose) {
        case 'right':
          swipeDirection = 'swiperight';
          break;
        case 'left':
          swipeDirection = 'swipeleft';
          break;
        case 'up':
          swipeDirection = 'swipeup';
          break;
        case 'down':
          swipeDirection = 'swipedown';
          break;
        default:
          swipeDirection = 'swipe';
      }
      hammerElem.on(swipeDirection, function() {
        foundationApi.publish(attrs.id, 'close');
      });
    }
  }

  zfHardToggle.$inject = ['FoundationApi'];

  function zfHardToggle(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.closeActiveElements({exclude: attrs.zfHardToggle});
        foundationApi.publish(attrs.zfHardToggle, 'toggle');
        e.preventDefault();
      });
    }
  }

})();
