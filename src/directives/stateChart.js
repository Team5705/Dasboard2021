angular.module('Dashboard').directive("state", function(){
    return {
        restrict: 'E',
        scope:{
            state: '=',
            width: '=',
            height: '='
        },
        template: "<canvas id='canvas' width='size.width' height='size.height'/>",
        link: function(scope, element, attrs) {
            scope.canvas = element.find('canvas')[0];
            scope.ctx = scope.canvas.getContext('2d');
            /** console.log(element); */
            /*console.log(scope.ctx); */

            scope.canvas.width = scope.width;
            scope.canvas.height = scope.height;

            var ctx = scope.ctx;
            var state = scope.state;

            var width = scope.canvas.offsetWidth;
            var height = scope.canvas.offsetHeight;
            var centerX = width / 2;
            var centerY = height / 2;

            var backgroundColor= '#000000';
            var connected = '#0DBE16';

            function drawGraph(state) {
                var gradient = ctx.createLinearGradient(0,0, width, height);

                if (state){
                    gradient.addColorStop(0, '#0DBE16');
                    gradient.addColorStop(1, '#63f36a');
                }else{ 
                    gradient.addColorStop(0, '#FF0000');
                    gradient.addColorStop(1, '#ef5151');
                }

                //console.log(state);


                ctx.clearRect(0, 0, width, height);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = height;
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                ctx.lineTo(width, centerY);
                ctx.stroke();

                ctx.strokeStyle = backgroundColor;
                ctx.lineWidth = height;
                ctx.beginPath();
                ctx.moveTo(width, centerY);
                ctx.lineTo(width, centerY);
                ctx.stroke();
            }

            scope.$watch('state', function(newValue) {
                drawGraph(newValue);
              });
            
        }
    };

});