var monje = require('../../index.js');
var jstp = require('jstp');

monje.bind(jstp);

var db = new monje.mongodb.Db('test', new monje.mongodb.Server("localhost", 27017));
db.open( function (err, db) {
  monje.mongoConnection = db;
  
  jstp.listen({
    tcp: 33333
  });

});