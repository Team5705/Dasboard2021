let scp, defUI;

var app = angular.module("Dashboard", ["ngMaterial", "ngMessages", "nvd3"]);

app.config(function ($mdThemingProvider) {
  $mdThemingProvider.definePalette('black_desert', {
    '50': 'e4e4e4',
    '100': 'bcbcbc',
    '200': '909090',
    '300': '636363',
    '400': '414141',
    '500': '202020',
    '600': '1c1c1c',
    '700': '181818',
    '800': '131313',
    '900': '0b0b0b',
    'A100': 'e76c6c',
    'A200': 'e04040',
    'A400': 'ec0000',
    'A700': 'd30000',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [ '50', '100', '200', 'A100' ],
    'contrastLightColors': [ '300', '400', '500', '600', '700', '800', '900', 'A200', 'A400', 'A700' ]
  });
  $mdThemingProvider.definePalette("green_desert", {
    '50': "e5e9e5",
    '100': "bec8be",
    '200': "93a393",
    '300': "687e68",
    '400': "476247",
    '500': "274627",
    '600': "233f23",
    '700': "1d371d",
    '800': "172f17",
    '900': "0e200e",
    'A100': "61ff61",
    'A200': "2eff2e",
    'A400': "00fa00",
    'A700': "00e000",
    'contrastDefaultColor': "light",
    'contrastDarkColors': ["50", "100", "200", "A100", "A200", "A400", "A700"],
    'contrastLightColors': ["300", "400", "500", "600", "700", "800", "900"],
  });

  $mdThemingProvider.theme("default").dark().primaryPalette('black_desert').accentPalette('green_desert');
});

app.factory("updateService", () => {
  var updateService = {};

  updateService.data = {
    cameras: {
      limeCont: document.getElementById("limelight"),
      limelight: '',
      usbCont: document.getElementById("usb"),
      usb: '',
    },
    sensors: {
      gyroAngle: 0.0,
      isGyroCalibrated: false,
      switch1: false,
      switch2: false,
      switch3: false,
      swithc4: false,
    },
    motors: {
      leftEncoder: 0.0,
      leftRate: 0.0,
      leftPosition: 0.0,
      rightEncoder: 0.0,
      rightRate: 0.0,
      rightPosition: 0.0,
    },
    pneumatics: {
      intake: false,
    },
    vision: {
      x: 0.0,
      y: 0.0,
      area: 0.0,
      targetVisible: false,
      xDistance: 0.0,
    },
    match: {
      time: '0:00',
      phase: "not started",
    },
    autoMode: {
      selectedMode: "forward",
      availableModes: { },
    },
    communication: {
      robot: false,
      robotState: 'Robot disconnected',
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

app.controller("uiCtrl", ($scope, updateService) => {

  $scope.data = updateService.data;
  $scope.updateService = updateService;
  
  scp = $scope;

  updateCameras($scope)

});

let updateCameras = ($scope) => {
  var l_ = $scope.data.cameras.limelight,
      c_ = $scope.data.cameras.usb;
  if (l_ === '') {
    $scope.data.cameras.limeCont.style.background = "url('../images/notFound.png') no-repeat";
  }else{
    $scope.data.cameras.limeCont.style.background = "url("+l_+") no-repeat";
  }
  if (c_ === '') {
    $scope.data.cameras.usbCont.style.background = "url('../images/notFound.png') no-repeat";
  }else{
    $scope.data.cameras.usbCont.style.background = "url("+c_+") no-repeat";
  }
  $scope.data.cameras.limeCont.style.backgroundSize = "100% 100%";
  $scope.data.cameras.usbCont.style.backgroundSize = "100% 100%";
}

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
      var autonomous = $scope.autoSelected.toLowerCase();
      updateService.onValueChanged('autoMode/selectedMode', autonomous);
      NetworkTables.putValue('/SmartDashboard/autoMode/active', autonomous);
      console.log("Auto selected: " + autonomous);
    }
});
