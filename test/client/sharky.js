var monje = require('../../index.js');

monje.jstp.delete({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Film']
});

var first = true;
var Film = {
  bind: function (dispatch) {
    console.log(dispatch.body);
  }
}



setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Film'],
    body: {
      name: "Jurassic Park",
      director: "Stanley Kubrick"
    }
  }).post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Film'],
    body: {
      name: "Shark",
      director: "Stanley Kubrick"
    }
  });

  setTimeout( function () {
    monje.jstp.bind({
      host: [['localhost', 33333, 'tcp']],
      endpoint: {
        method: 'PUT',
        resource: ['Film', '*']
      }
    }, Film.bind, Film);
    monje.jstp.patch({
      host: [['localhost', 33333, 'tcp']],
      resource: ['Film', '*'],
      body: {
        filters: { director: 'Stanley Kubrick' },
        data: { director: 'Steven Spielberg' }
      }
    });
  }, 500);
}, 100);