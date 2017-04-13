// Library allows logging data to the expose-db module
// Constructor creates table if it does not exist
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
// config.databaseLocation = 10.50.0.106
//
// //Use Example
// var logToDB = require("./logToDB");
// var db = new logToDB(config.databaseLocation, config.detector);
// db.log({"Zero":5}); 
// 

// Imports
var request = require('request'); // Create http requests

module.exports = class logToDB {
    constructor(databaseLocation, detector) {
        // databaseLocation is the base URL you are logging to
        this.databaseLocation = databaseLocation;
        // Detector configuration object
        this.detector = detector;
        // Then create the table
        this._createTable(detector);
    }

    log(data) {
        // Clone the data object to send, so it does not get modified when we add the api key
        var query =  Object.assign({},data);
        query.apiKey = this.detector.apiKey;

        // Send the data to the database given
        request.post({
            url: this.databaseLocation + "/api/db/add/" + this.detector.alias,
            qs: query
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(body);
            } else {
                // console.log(response);
            }
        });
    }

    _createTable(detector) {
        // Server requires the fields to be a string
        var query = Object.assign({},detector);
        query.fields = JSON.stringify(query.fields);
        request.post({
            url: this.databaseLocation + "/api/db/add/detector",
            qs: query
        },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (JSON.parse(body).name == "SequelizeUniqueConstraintError") {
                        return "Database with alias already exists";
                    } else if (JSON.parse(body).name == detector.name) {
                        return (detector.name + " Created");
                    } else {
                        // Perhaps a error
                        console.log(body);
                    }
                } else {
                    console.log(error);
                }
            }
        );
    }


} 