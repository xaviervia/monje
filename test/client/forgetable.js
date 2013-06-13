var monje = require('../../index.js');

var Forgetable = {
  bind: function (dispatch) {
    monje.jstp.delete({
      host: [['localhost', 33333, 'tcp']],
      resource: dispatch.resource
    });
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Forgetable', '*']
  }
}, Forgetable.bind, Forgetable);


setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Forgetable'],
    body: {
      name: "John",
      last: "Doe"
    }
  });
}, 1000);