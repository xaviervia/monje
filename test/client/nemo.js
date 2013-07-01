var monje = require('../../index.js');

var Nemo = {
  bind: function (engine, answer, dispatch) {
    monje.jstp.delete({
      host: [['localhost', 33333, 'tcp']],
      resource: [dispatch.resource[0], dispatch.resource[1], 'name']
    });
  },

  out: function (engine, answer, dispatch) {
    console.log(dispatch);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Nemo', '*']
  }
}, Nemo.bind, Nemo).
bind({
  host: [['localhost', 33333, 'tcp']],
    endpoint: {
    method: 'DELETE',
    resource: ['Nemo', '*', '*']
  }
}, Nemo.out, Nemo);


setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Nemo'],
    body: {
      name: "John",
      last: "Doe"
    }
  });
}, 1000);