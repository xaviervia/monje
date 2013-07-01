var monje = require('../../index.js');

var second = false;
var third = false;
var Nemo = {
  bind: function (engine, answer, dispatch) {
    if (third) {
      monje.jstp.delete({
        host: [['localhost', 33333, 'tcp']],
        resource: [dispatch.resource[0], '*', 'name'],
        body: {
          filters: {
            last: 'Doe'
          }
        }
      });      
    }
    else {
      if (second) third = true;
      else second = true;
    }
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
  }).post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Nemo'],
    body: {
      name: "Jane",
      last: "Doe",
      gender: 'female'
    }
  }).post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Nemo'],
    body: {
      name: "Jane",
      last: "Smith",
      gender: 'female'
    }
  });
}, 1000);