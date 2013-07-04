var monje = require("../../../index.js");

monje.bind();

var db = new monje.mongodb.Db('test', new monje.mongodb.Server("localhost", 27017));
db.open( function (err, db) {
  monje.mongoConnection = db;

  var Resource = {
    answer: function (engine, answer) {
      console.log(answer);
    }
  }

  monje.jstp.delete({
    resource: ["User"]
  });

  setTimeout( function () {
    monje.jstp.get({
      resource: ["User"],
      body: {
        filters: {
          name: "pepe"
        }
      }
    }, Resource.answer, Resource);
  }, 1000);

});