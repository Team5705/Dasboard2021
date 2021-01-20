/* ONLY FOR TESTING */

app.controller("sendAuto", ["$scope", function ($scope) {
    $scope.autoState = false;
    $scope.updateA = function () {
      if (!NetworkTables.isRobotConnected()) {
        alert('Error: Robot is not connected!');
        return;
      }
      $scope.autoState = !$scope.autoState;
      NetworkTables.putValue("/data/autoState", $scope.autoState);
      console.log("Auto state: " + $scope.autoState);
    };
  },
]);

// Key Listeners

/* Streams */

  NetworkTables.addKeyListener("/CameraPublisher/USB Camera 0/streams", (key, value) => {
      var stream = value[0].replace("mjpg:","");

      console.log(stream);
  
      scp.updateService.onValueChanged("cameras/usb", stream);
      scp.$apply();

      updateCameras(scp);
    }
  );
  
/* Automodes */
  
  NetworkTables.addKeyListener( "/SmartDashboard/Auto Mode/options", (key, value) => {
      console.log(value);
      scp.updateService.onValueChanged("autoMode/availableModes", value);
      scp.$apply();
    }
  );
  
  /* Pneumatics */
  
  NetworkTables.addKeyListener("/SmartDashboard/intakeDeployed", (key, value) => {
    if (value) {
      scp.data.robotDiagram.intakeArm.setAttribute("transform", "rotate(" + 85 + ", 148, 195)");
      scp.data.robotDiagram.piston.setAttribute("transform", "rotate(-6, 90, 117)");
      scp.data.robotDiagram.pistonExtension.setAttribute("x2", "165");
      scp.data.robotDiagram.pistonExtension.setAttribute("y2", "205");
    } else {
      scp.data.robotDiagram.intakeArm.setAttribute("transform", "rotate(" + 0 + ", 148, 200)");
      scp.data.robotDiagram.piston.setAttribute("transform", "rotate(0, 90, 117)");
      scp.data.robotDiagram.pistonExtension.setAttribute("x2", "152");
      scp.data.robotDiagram.pistonExtension.setAttribute("y2", "188");
    }
    console.log("intake: " + value);
  
    scp.updateService.onValueChanged("pneumatics/intake", value);
    scp.$apply();
  });
  
  /* GameData */
  
  NetworkTables.addKeyListener("/SmartDashboard/gamedata", (key, value) => {
    console.log("gamedata: " + value);
  
    scp.updateService.onValueChanged("gamedata/color", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/R", (key, value) => {
    console.log("Red: " + value);
  
    scp.updateService.onValueChanged("gamedata/R", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/G", (key, value) => {
    console.log("Green: " + value);
  
    scp.updateService.onValueChanged("gamedata/G", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/B", (key, value) => {
    console.log("Blue: " + value);
  
    scp.updateService.onValueChanged("gamedata/B", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/Y", (key, value) => {
    console.log("Yellow: " + value);
  
    scp.updateService.onValueChanged("gamedata/Y", value);
    scp.$apply();
  });
  
  /* Motors data */

  NetworkTables.addKeyListener("/SmartDashboard/encoder_L", (key,value) => {
    scp.updateService.onValueChanged('motors/leftEncoder', roundVal(value));
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/positionL", (key,value) => {
    scp.updateService.onValueChanged('motors/leftPosition', roundVal(value));
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/rateL", (key,value) => {
    scp.updateService.onValueChanged('motors/leftRate', value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/encoder_R", (key,value) => {
    scp.updateService.onValueChanged('motors/rightEncoder', roundVal(value));
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/positionR", (key,value) => {
    scp.updateService.onValueChanged('motors/rightPosition', roundVal(value));
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/rateR", (key,value) => {
    scp.updateService.onValueChanged('motors/rightRate', value);
    scp.$apply();
  });

  /* Sensors data */
  
  NetworkTables.addKeyListener("/SmartDashboard/1", (key, value) => {
    scp.updateService.onValueChanged("sensors/switch1", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/2", (key, value) => {
    scp.updateService.onValueChanged("sensors/switch2", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/3", (key, value) => {
    scp.updateService.onValueChanged("sensors/switch3", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/4", (key, value) => {
    scp.updateService.onValueChanged("sensors/switch4", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/SmartDashboard/gyro", (key, value) => {
    scp.updateService.onValueChanged("sensors/gyroAngle", roundVal(value));
    scp.$apply();
  });
  
  NetworkTables.addKeyListener("/SmartDashboard/navX-MXP_Calibrated", (key, value) => {
    scp.updateService.onValueChanged("sensors/isGyroCalibrated", value);
    scp.$apply();
  });

addEventListener("error", (ev) => {
  ipc.send("windowError", { mesg: ev.message, file: ev.filename, lineNumber: ev.lineno,});
});

/* Function to round 3 decimals */
let roundVal = (value) => {
  return parseFloat(Math.round(value * 1000) / 1000).toFixed(3);
}