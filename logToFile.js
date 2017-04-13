// Library allows logging data to the local filesystem
// Constructor creates file if it does not exist
//
// 
// detector object is the configuration model, an example is 
// 
// config.detector = {};
// config.detector.name = "Lloyd Wright";
// config.detector.description = "First three paddle detector.";
// config.detector.alias = "lloydWright";
// config.detector.apiKey = "a3e68f42-03f6-4570-85bd-cc5f66c2da96";
// config.detector.tags = "Three Paddle, Humidity, GPS";
// config.detector.location = "Atlanta, GA";
// config.detector.public = "true";
// config.detector.fields = {"Zero":"int(11)"}
// 
// var logToFile = require("./logToFile");
// var file = new logToFile(config.logDir, config.detector);
// file.log({"Zero":5});
// 
// Imports
const fs = require('fs'); //Acsess the filesystem


module.exports = class logToFile {
    constructor(logDir, detector) {
        // Log directory reletive to current direcory
        this.logDir = logDir;
        // Detector configuration object
        this.detector = detector;
        //If logDir directory does not exist, create it
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        this._createFile(detector);
    }

    log(data) {
        var logLine = new Date().toISOString() + ",";
        for(var entry in data){
            logLine += data[entry];
            logLine += ",";
        }
        logLine += "\n";
        // Append the line to the file
        fs.appendFile(this.logDir + "/" + this.fileName, logLine, function (err) {
        });
    }

    _createFile(detector) {

        // File is uniquely named by start time and the alias
        var fileName = this.detector.alias + "-" + new Date().toISOString()  + ".log";

        // Header is created through fields, prepended with date append with newline
        var header = "date,";
        for (var field in detector.fields) {
            header += field;
            header += ",";
        }
        header += "\n";

        //Write just the header to the file creating it in the process
        fs.writeFile(this.logDir + "/" + fileName, header, function (err) {
            if (err) {
                throw err;
            }
            console.log("Logging started in " + fileName);
        });

        this.fileName = fileName;
    }

} 