//variables we'll need
var http = require ("http"),
    mongoose = require ("mongoose"),
    dbConnString = 'mongodb://localhost/myMongooseDb',
    dbport = 5000,
    salesSchema = null,//just a placeholder, we'll overwrite this a bit later
    salesMember = null;//just a placeholder, we'll overwrite this a bit later

//connect to the database
mongoose.connect(dbConnString,function(err, res){
    if (err){
        console.log ("ERROR connecting to: " + dbConnString + "! " + err);
    } else {
        console.log ("Successfully connected to: " + dbConnString);
    }
});

//define the schema to use
salesSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    phone: String
});

//define the data model, using the schema that we just created
salesMember = mongoose.model("Sales", salesSchema);

// Clear out old data
salesMember.remove({}, function(err) {
    if (err) {
        console.log ("There was an error deleting the old data.");
    } else  {
        console.log ("Successfully deleted the old data.");
    }
});

//create a new sales member
var salesMemberDocument = new salesMember ({
    name: { first: "Gary", last: "Newman" },
    phone: "212-555-1212"
});

//save the new user to the database.
salesMemberDocument.save(function (err) {
    if (err) console.log ("Error on save!");
});

//create a server instance, and start it
http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});

    salesMember.find({}).exec(function(err, result) {
        if (!err) {
            res.end(JSON.stringify(result, undefined, 2));
        } else {
            res.end("Error in query. " + err)
        };
    });

}).listen(dbport);