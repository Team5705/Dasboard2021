var app = angular.module("Dashboard", ["ngMaterial", "ngMessages"]);

app.config(function ($mdThemingProvider) {
  $mdThemingProvider.definePalette("green", {
    50: "e5e9e5",
    100: "bec8be",
    200: "93a393",
    300: "687e68",
    400: "476247",
    500: "274627",
    600: "233f23",
    700: "1d371d",
    800: "172f17",
    900: "0e200e",
    A100: "61ff61",
    A200: "2eff2e",
    A400: "00fa00",
    A700: "00e000",
    contrastDefaultColor: "light",
    contrastDarkColors: ["50", "100", "200", "A100", "A200", "A400", "A700"],
    contrastLightColors: ["300", "400", "500", "600", "700", "800", "900"],
  });

  $mdThemingProvider.theme("default").primaryPalette("green");
});

app.factory("updateService", () => {
  var updateService = {};

  updateService.data = {
    enabled: true,
    cameras: {
      limeCont: document.getElementById("limelight"),
      limelight: "https://firstfrc.blob.core.windows.net/frc2020/Backgrounds%2FInfiniteRecharge_001.png",
      usbCont: document.getElementById("usb"),
      usb: "https://www.bottone.io/wp-content/uploads/2020/03/Ftc-Simulator-Screenshot-2020.03.16-17.21.12.92-1024x486.png",
    },
    sensors: {
      gyroAngle: 0,
      isGyroCalibrated: false,
      switch1: false,
      switch2: false,
      switch3: false,
      swithc4: false,
    },
    motors: {
      leftEncoder: 0,
      leftRate: 0,
      leftPosition: 0,
      rightEncoder: 0,
      rightRate: 0,
      rightPosition: 0,
    },
    pneumatics: {
      intake: false,
    },
    vision: {
      x: 0,
      y: 0,
      targetVisible: false,
      xDistance: 0,
    },
    match: {
      time: '0:00',
      phase: "not started",
    },
    autoMode: {
      selectedMode: "forward",
      availableModes: {
          1: 'center'
      },
    },
    communication: {
      robot: false,
    },
    robotDiagram: {
      intakeArm: document.getElementById("intake-arm"),
      piston: document.getElementById("piston"),
      pistonExtension: document.getElementById("piston-extension"),
    },
    gamedata: {
        color: '',
        R: false,
        G: false,
        B: false,
        Y: false
    }
  };

  updateService.sendValue = function (key, value) {
    NetworkTables.putValue(key, value);
  };

  updateService.getValue = function (key) {
    NetworkTables.getValue(key);
  };

  updateService.getProperty = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    var a = s.split("/");
    for (var i = 0, n = a.length - 1; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  };

  updateService.onValueChanged = function (key, value, isNew) {
    if (value == "true") {
      value = true;
    } else if (value == "false") {
      value = false;
    }

    var a = key.split("/");
    updateService.getProperty(updateService.data, key)[a[a.length - 1]] = value;
  };

  updateService.onConnection = function (connected) {
    updateService.data.communication.robot = connected;
  };

  // NetworkTables.addRobotConnectionListener(updateService.onConnection, true);
	// NetworkTables.addGlobalListener(updateService.onValueChanged, true);

  return updateService;
});

let scp;

app.controller("uiCtrl", ($scope, updateService) => {
  $scope.data = updateService.data;
  $scope.updateService = updateService;
  
  scp = $scope;

  updateCameras($scope)

});

let updateCameras = ($scope) => {
    $scope.data.cameras.limeCont.style.background = "url("+ $scope.data.cameras.limelight+") no-repeat";
    $scope.data.cameras.limeCont.style.backgroundSize = "100% 100%"
    $scope.data.cameras.usbCont.style.background = "url("+ $scope.data.cameras.usb+") no-repeat";
    $scope.data.cameras.usbCont.style.backgroundSize = "100% 100%"
}

app.controller('tabCtrl', ($scope) => {
    $scope.data = {
        selectedIndex: 0
    }
    $scope.next = () => {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
    }
    $scope.previous = () => {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    }
});

app.controller('cameraCtrl', ($scope, updateService) => {
    $scope.data = updateService.data
    
    $scope.updateSources = function () {
        updateService.onValueChanged('cameras/limelight', $scope.data.cameras.limelight);
        updateService.onValueChanged("cameras/usb", $scope.data.cameras.usb);
        
        console.log('Lime: ' + $scope.data.cameras.limelight);
        console.log('USB: ' + $scope.data.cameras.usb);
        
        updateCameras($scope);
    }
});

app.controller('autoCtrl', ($scope, updateService) => {
    $scope.data = updateService.data;

    $scope.updateAuto = () => {
      NetworkTables.putValue('/data/autoSelected/', $scope.autoSelected);
      console.log("Auto selected: " + $scope.autoSelected);
    }
});