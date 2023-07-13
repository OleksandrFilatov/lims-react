
var Port = 5000;
var MongoUri = "mongodb://localhost:27017/LIMS";
// var MongoUri = "mongodb://mongo:27017/LIMS";
var jwtSecret = 'jwtSecret';
var dbOptions = {
    host: 'localhost',
    port: 27017,
    database: 'LIMS',
}

module.exports = {
    Port,
    MongoUri,
    jwtSecret,
    dbOptions
}