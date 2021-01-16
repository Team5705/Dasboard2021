angular.module("Dashboard").directive("stateIndicator", function () {
  return {
    restrict: "E",
    scope: {
      value: "=",
      radio: "=",
      width: "=",
      height: "=",
    },
    template: "<canvas id='canvas' width='size.width' height='size.height'/>",
    link: function (scope, element, attrs) {
      scope.canvas = element.find("canvas")[0];
      scope.ctx = scope.canvas.getContext("2d");

      scope.canvas.width = scope.width;
      scope.canvas.height = scope.height;
      var ctx = scope.ctx;
      var radius = scope.radio;

      scope.size = {
        width: scope.width,
        height: scope.height,
      };

      var width = scope.canvas.offsetWidth;
      var height = scope.canvas.offsetHeight;
      var centerX = width / 2;
      var centerY = height / 2;

      var outLine = ctx.createRadialGradient( centerX - 5, centerY - 3, radius / 8, centerX, centerY, radius);
          outLine.addColorStop(0, "#b3b3b3");
          outLine.addColorStop(1, "#414141");

      function drawIndicator(value) {
        var inside = ctx.createRadialGradient( centerX - 5, centerY - 3, radius / 8, centerX, centerY, radius- radius /3);

        if (value) {
          inside.addColorStop(0, "#63f36a");
          inside.addColorStop(1, "#0DBE16");
        } else {
          inside.addColorStop(0, "#ef5151");
          inside.addColorStop(1, "#FF0000");
        }

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = ctx.fillStyle = outLine;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = ctx.fillStyle = inside;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - radius / 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }

      scope.$watch("value", function (newValue) {
        drawIndicator(newValue);
      });
    },
  };
});
