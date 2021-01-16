angular.module('Dashboard').directive("ball", function() {
    return {
      restrict: 'E',
      scope: {
        value: '=',
        radio: '=',
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
  
        scope.size = {
          width: scope.width,
          height: scope.height
        };
  
        var width = scope.canvas.offsetWidth;
        var height = scope.canvas.offsetHeight;
        var centerX = width / 2;
        var centerY = height / 2;
  
        var onCell = '#97ae97';

        var onRobot = ctx.createRadialGradient(centerX-5, centerY-3, radius/8, centerX, centerY, radius);
        onRobot.addColorStop(0, '#FBE9B7');
        //onRobot.addColorStop(1, '#EFB73F');
        onRobot.addColorStop(1, '#AB7E20');
        
        var without = ctx.createRadialGradient(centerX-5, centerY-3, radius/8, centerX, centerY, radius);
        without.addColorStop(0, '#EBEBEB');
        without.addColorStop(1, '#484848');
  
        function drawBall(value) {
          ctx.clearRect(0, 0, width, height);
            onCell = value ? onRobot : without;
            
            ctx.strokeStyle = ctx.fillStyle = onCell;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            if(!value){
              ctx.strokeStyle = ctx.fillStyle = 'rgba(0,0,0,0.2)';

              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
            }

        }

        scope.$watch('value', function(newValue) {
          drawBall(newValue);
        });
      }
    };
  });
  