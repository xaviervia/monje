var monje = require('../../index.js');

var Castle = {
  bind: function (engine, answer, dispatch) {
    console.log(dispatch.body);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'DELETE',
    resource: ['Castle', '*']
  }
}, Castle.bind, Castle);


setTimeout( function () {
  monje.jstp.delete({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Castle']
  });
}, 1000);