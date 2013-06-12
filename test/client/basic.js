var monje = require('../../index.js');

var User = {
  bind: function (dispatch) {
    console.log(dispatch.body);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['User', '*']
  }
}, User.bind, User);


setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['User'],
    body: {
      name: "John",
      last: "Doe"
    }
  });
}, 1000);