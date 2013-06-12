var monje = require('../../index.js');

monje.bind();

var db = new monje.mongodb.Db('test', new monje.mongodb.Server("localhost", 27017));
db.open( function (err, db) {
  monje.mongoConnection = db;
  
  monje.jstp.listen({
    tcp: 33333
  });

});