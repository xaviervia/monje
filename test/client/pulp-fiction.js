var monje = require('../../index.js');

monje.jstp.delete({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Film']
});

var first = true;
var Film = {
  bind: function (engine, answer, dispatch) {
    if (first) {
      monje.jstp.patch({
        host: [['localhost', 33333, 'tcp']],
        resource: ['Film', dispatch.resource[1]],
        body: {
          director: 'Steven Spielberg'
        }
      });
      first = false;
    }
    else console.log(dispatch.body);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Film', '*']
  }
}, Film.bind, Film);


setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Film'],
    body: {
      name: "Jurassic Park",
      director: "Stanley Kubrick"
    }
  });
}, 1000);