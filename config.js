var config = {};

config.databaseLocation = "http://expose-db:8000";

// Route location is coming form load balancer
config.routeLocation = "/api/hardware";
config.apiPort = 8000;
config.logDir = "./logs"

// This is a array of i2c adresses of mppcInterface devices
config.mppcInterface = [0x08];

// Detector model
config.detector = {};
config.detector.name = "Lloyd Wright";
config.detector.description = "First three paddle detector, 2mmx2mm 50uM pixel size TSV MPPC Attached to 145mmx145mm plastic scintilator pannel with embedded fibers.";
config.detector.alias = "lloydWright";
config.detector.apiKey = "a3e68f42-03f6-4570-85bd-cc5f66c2da96";
config.detector.tags = "Three Paddle, Humidity, GPS";
config.detector.location = "Atlanta, GA";
config.detector.public = "true";

//Coincidence: Intruept pins to log counts from
config.pins = [
    ['Zero and One'  , 17],
    ['Zero and Two'  , 18],
    ['Zero and Three', 27],
    ['One and Two'   , 11],
    ['One and Three' , 25],
    ['Two and Three' , 09],
    ['Zero'          , 24],
    ['One'           , 23],
    ['Two'           , 22],
    ['Three'         , 10],
];

//Sensor: functions to get data
config.sensors = [
    gps,
    latitude,
    longitude,
    altitude,
    pressure,
    temp,
    humidity,
    voltage0,
    voltage1,
    voltage2,
    voltage3,
    temp0,
    temp1,
    temp2,
    temp3
];

// Get all the data from the GPS module, and send that.
var gpsData; //Single variable only set once per aggergate data
function gps(){
    var NEO6m = require('./neo6m/neo6m.js');
    var gps = new NEO6m();
    while (true) {
        try {
            var data = gps.data();
        } catch (EIO) {
            return { gps: "Communication error" };
            break;
        }
        if (data != null) {
            gpsData = data;
            return {gps: data.valid};
            break;
        }
    }
}
function latitude (){
    return {latidude : gpsData.latitude};
}
function longitude(){
    return {longitude : gpsData.longitude};
}
function altitude(){
    return {altitude : gpsData.altitude};
}
function temp(){
    var SHT3x = require("./sht3x/sht3x.js");
    var sht32 = new SHT3x();
    return({temp: sht32.data().temp_C});
}
function humidity(){
    var SHT3x = require("./sht3x/sht3x.js");
    var sht32 = new SHT3x();
    return({humidity: sht32.data().RH});
}
function pressure(){
    var MPL3115A2 = require("./mpl3115a2/mpl3115a2.js");
    var mpl3115a2 = new MPL3115A2();
    return {pressure: mpl3115a2.data().pascals};
}

// Voltage and temprature functions
function voltage0(){
    var MppcInterface = require('./mppc-interface/mppc-interface.js');
    var mppcInterface = new MppcInterface(this.mppcInterface[0]);
    return {voltage0: mppcInterface.readVoltage(0)};
}
function voltage1(){
    var MppcInterface = require('./mppc-interface/mppc-interface.js');
    var mppcInterface = new MppcInterface(this.mppcInterface[0]);
    return {voltage1: mppcInterface.readVoltage(1)};
}
function voltage2(){
    var MppcInterface = require('./mppc-interface/mppc-interface.js');
    var mppcInterface = new MppcInterface(this.mppcInterface[0]);
    return {voltage2: mppcInterface.readVoltage(2)};
}
function voltage3(){
    var MppcInterface = require('./mppc-interface/mppc-interface.js');
    var mppcInterface = new MppcInterface(this.mppcInterface[0]);
    return {voltage3: mppcInterface.readVoltage(3)};
}
function temp0(){
    var MppcInterface = require('./mppc-interface/mppc-interface.js');
    var mppcInterface = new MppcInterface(this.mppcInterface[0]);
    return {temp0: mppcInterface.readTemp(0)};
}
function temp1(){
    var MppcInterface = require('./mppc-interface/mppc-interface.js');
    var mppcInterface = new MppcInterface(this.mppcInterface[0]);
    return {temp1: mppcInterface.readTemp(1)};
}
function temp2(){
    var MppcInterface = require('./mppc-interface');
    var mppcInterface = new MppcInterface(this.mppcInterface[0]);
    return {temp2: mppcInterface.readTemp(2)};
}
function temp3(){
    var MppcInterface = require('./mppc-interface/mppc-interface.js');
    var mppcInterface = new MppcInterface(this.mppcInterface[0]);
    return {temp3: mppcInterface.readTemp(3)};
}

module.exports = config;