var monje = require('../../index.js');

var Castle = {
  bind: function (engine, answer, dispatch) {
      monje.jstp.get({
        host: [['localhost', 33333, 'tcp']],      
        resource: ['Castle', dispatch.body._id, 'words']
      }, Castle.bind, Castle);
    }
  ,
  bound: function (engine, answer, dispatch) {
    console.log("They say: " + dispatch.body);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Castle', '*']
  }
}, Castle.bind, Castle).bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Castle', '*', '*']
  }
}, Castle.bound, Castle);

setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Castle'],
    body: {
      name: "Pyke",
      house: "Greyjoy",
      words: "We do not sow"
    }
  });
}, 1000);
