var monje = require('../../index.js');

var firstTime = true;
var Castle = {
  bind: function (dispatch) {
    if (firstTime) {
      firstTime = false;
      monje.jstp.get({
        host: [['localhost', 33333, 'tcp']],      
        resource: ['Castle', dispatch.body._id]
      }, Castle.bind, Castle);
    }
    else console.log("The " + dispatch.body.house + " in " + dispatch.body.name + " says: " + dispatch.body.words);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Castle', '*']
  }
}, Castle.bind, Castle);



setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Castle'],
    body: {
      name: "Winterfell",
      house: "Stark",
      words: "Winter is coming"
    }
  });
}, 1000);