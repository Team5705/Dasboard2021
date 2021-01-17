// Define UI elements
let ui = {
  camera: document.getElementById("camera"),
  timer: document.getElementById("timer"),
  robotState: document.getElementById("robot-state").firstChild,
};

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

// Gyro rotation
// let updateGyro = (key, value) => {
//     ui.gyro.val = value;
//     ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
//     ui.gyro.visualVal %= 360;
//     if (ui.gyro.visualVal < 0) {
//         ui.gyro.visualVal += 360;
//     }
//     ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
//     ui.gyro.number.textContent = ui.gyro.visualVal + 'º';
// };
// NetworkTables.addKeyListener('/SmartDashboard/drive/navx/yaw', updateGyro);

/* Streams */

  NetworkTables.addKeyListener(
    "/CameraPublisher/USB Camera 0/streams",
    (key, value) => {
      var stream = value[0].replace("mjpg:","");

      console.log(stream);
  
      scp.updateService.onValueChanged("cameras/usb", stream);
      scp.$apply();

      updateCameras(scp);
    }
  );
  
  /* Automodes */
  
  NetworkTables.addKeyListener(
    "/SmartDashboard/Auto Mode/options",
    (key, value) => {
      console.log(value);
      scp.updateService.onValueChanged("autoMode/availableModes", value);
      scp.$apply();
    }
  );
  
  /* Pneumatics */
  
  NetworkTables.addKeyListener("/data/pneumatics/intake", (key, value) => {
    if (value) {
      scp.data.robotDiagram.intakeArm.setAttribute(
        "transform",
        "rotate(" + 85 + ", 148, 195)"
      );
      scp.data.robotDiagram.piston.setAttribute(
        "transform",
        "rotate(-6, 90, 117)"
      );
      scp.data.robotDiagram.pistonExtension.setAttribute("x2", "165");
      scp.data.robotDiagram.pistonExtension.setAttribute("y2", "205");
    } else {
      scp.data.robotDiagram.intakeArm.setAttribute(
        "transform",
        "rotate(" + 0 + ", 148, 200)"
      );
      scp.data.robotDiagram.piston.setAttribute(
        "transform",
        "rotate(0, 90, 117)"
      );
      scp.data.robotDiagram.pistonExtension.setAttribute("x2", "152");
      scp.data.robotDiagram.pistonExtension.setAttribute("y2", "188");
    }
    console.log("intake" + value);
  
    scp.updateService.onValueChanged("pneumatics/intake", value);
    scp.$apply();
  });
  
  /* GameData */
  
  NetworkTables.addKeyListener("/data/gamedata/color", (key, value) => {
    console.log("gamedata: " + value);
  
    scp.updateService.onValueChanged("gamedata/color", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/data/gamedata/R", (key, value) => {
    console.log("Red: " + value);
  
    scp.updateService.onValueChanged("gamedata/R", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/data/gamedata/G", (key, value) => {
    console.log("Green: " + value);
  
    scp.updateService.onValueChanged("gamedata/G", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/data/gamedata/B", (key, value) => {
    console.log("Blue: " + value);
  
    scp.updateService.onValueChanged("gamedata/B", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/data/gamedata/Y", (key, value) => {
    console.log("Yellow: " + value);
  
    scp.updateService.onValueChanged("gamedata/Y", value);
    scp.$apply();
  });
  
  /* Sensors data */
  
  NetworkTables.addKeyListener("/data/sensors/s1", (key, value) => {
    scp.updateService.onValueChanged("sensors/switch1", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/data/sensors/s2", (key, value) => {
    scp.updateService.onValueChanged("sensors/switch2", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/data/sensors/s3", (key, value) => {
    scp.updateService.onValueChanged("sensors/switch3", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/data/sensors/s4", (key, value) => {
    scp.updateService.onValueChanged("sensors/switch4", value);
    scp.$apply();
  });
  NetworkTables.addKeyListener("/data/sensors/gyro", (key, value) => {
    scp.updateService.onValueChanged("sensors/gyroAngle", value);
    scp.$apply();
  });
  
  NetworkTables.addKeyListener("/data/sensors/isGyroCalibrated", (key, value) => {
    scp.updateService.onValueChanged("sensors/isGyroCalibrated", value);
    scp.$apply();
  });

// The following case is an example, for a robot with an arm at the front.
// NetworkTables.addKeyListener('/SmartDashboard/arm/encoder', (key, value) => {
//     // 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
//     if (value > 1140) {
//         value = 1140;
//     }
//     else if (value < 0) {
//         value = 0;
//     }
//     // Calculate visual rotation of arm
//     var armAngle = value * 3 / 20 - 45;
//     // Rotate the arm in diagram to match real arm
//     ui.robotDiagram.arm.style.transform = `rotate(${armAngle}deg)`;
// });

// // This button is just an example of triggering an event on the robot by clicking a button.
// NetworkTables.addKeyListener('/SmartDashboard/example_variable', (key, value) => {
//     // Set class active if value is true and unset it if it is false
//     ui.example.button.classList.toggle('active', value);
//     ui.example.readout.data = 'Value is ' + value;
// });

// NetworkTables.addKeyListener('/robot/time', (key, value) => {
//     // This is an example of how a dashboard could display the remaining time in a match.
//     // We assume here that value is an integer representing the number of seconds left.
//     ui.timer.textContent = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
// });

// // Load list of prewritten autonomous modes
// NetworkTables.addKeyListener('/SmartDashboard/autonomous/modes', (key, value) => {
//     // Clear previous list
//     while (ui.autoSelect.firstChild) {
//         ui.autoSelect.removeChild(ui.autoSelect.firstChild);
//     }
//     // Make an option for each autonomous mode and put it in the selector
//     for (let i = 0; i < value.length; i++) {
//         var option = document.createElement('option');
//         option.appendChild(document.createTextNode(value[i]));
//         ui.autoSelect.appendChild(option);
//     }
//     // Set value to the already-selected mode. If there is none, nothing will happen.
//     ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
// });

// // Load list of prewritten autonomous modes
// NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
//     ui.autoSelect.value = value;
// });

// // The rest of the doc is listeners for UI elements being clicked on
// ui.example.button.onclick = function() {
//     // Set NetworkTables values to the opposite of whether button has active class.
//     NetworkTables.putValue('/SmartDashboard/example_variable', this.className != 'active');
// };
// // Reset gyro value to 0 on click
// ui.gyro.container.onclick = function() {
//     // Store previous gyro val, will now be subtracted from val for callibration
//     ui.gyro.offset = ui.gyro.val;
//     // Trigger the gyro to recalculate value.
//     updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
// };
// // Update NetworkTables when autonomous selector is changed
// ui.autoSelect.onchange = function() {
//     NetworkTables.putValue('/SmartDashboard/autonomous/selected', this.value);
// };
// // Get value of arm height slider when it's adjusted
// ui.armPosition.oninput = function() {
//     NetworkTables.putValue('/SmartDashboard/arm/encoder', parseInt(this.value));
// };

addEventListener("error", (ev) => {
  ipc.send("windowError", {
    mesg: ev.message,
    file: ev.filename,
    lineNumber: ev.lineno,
  });
});
