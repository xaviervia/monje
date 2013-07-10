var monje = require("../../../index.js");

monje.bind();

var db = new monje.mongodb.Db('test', new monje.mongodb.Server("localhost", 27017));
db.open( function (err, db) {
  monje.mongoConnection = db;
  
  var Resource = {
    postAnswer: function (engine, answer) {
      engine.delete({
        resource: ["User", answer.body]
      }, Resource.deleteAnswer, Resource);
    },

    deleteAnswer: function (engine, answer) {
      console.log(answer);
    }
  }

  monje.jstp.post({
    resource: ["User"],
    body: {
      name: "pepe"
    }
  }, Resource.postAnswer, Resource);

});