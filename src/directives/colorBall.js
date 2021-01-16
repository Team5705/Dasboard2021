angular.module('Dashboard').directive("colorBall", function() {
    return {
      restrict: 'E',
      scope: {
        value: '=',
        radio: '=',
        color: '@',
        width: '=',
        height: '='
      },
      template: "<canvas id='canvas' width='size.width' height='size.height'/>",
      link: function(scope, element, attrs) {
        scope.canvas = element.find('canvas')[0];
        scope.ctx = scope.canvas.getContext('2d');
  
        scope.canvas.width = scope.width;
        scope.canvas.height = scope.height;
        var ctx = scope.ctx;
        var radius = scope.radio;
        var color = scope.color;
  
        scope.size = {
          width: scope.width,
          height: scope.height
        };
  
        var width = scope.canvas.offsetWidth;
        var height = scope.canvas.offsetHeight;
        var centerX = width / 2;
        var centerY = height / 2;
  
        var gradient;
        
        var without = ctx.createRadialGradient(centerX-5, centerY-3, radius/8, centerX, centerY, radius);
        without.addColorStop(0, '#b3b3b3');
        without.addColorStop(1, '#414141');
  
        function drawIndicator(value) {
          ctx.clearRect(0, 0, width, height);
        
            ctx.strokeStyle = ctx.fillStyle = without;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            
            ctx.strokeStyle = ctx.fillStyle = color;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius-(radius/3), 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            if(!value){
            ctx.strokeStyle = ctx.fillStyle = 'rgba(0,0,0,0.85)';

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            }
        }

        scope.$watch('value', function(newValue) {
          drawIndicator(newValue);
        });
      }
    };
  });
  