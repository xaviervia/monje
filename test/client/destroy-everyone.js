var monje = require('../../index.js');

var User = {
  bind: function (engine, answer, dispatch) {
    console.log(dispatch.body);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'DELETE',
    resource: ['User', '*']
  }
}, User.bind, User);


setTimeout( function () {
  monje.jstp.delete({
    host: [['localhost', 33333, 'tcp']],
    resource: ['User']
  });
}, 1000);