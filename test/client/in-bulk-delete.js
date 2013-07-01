var monje = require('../../index.js');

var second = false;
var third = false;
var Forgetable = {
  bind: function (engine, answer, dispatch) {
    if (third) {    
      monje.jstp.delete({
        host: [['localhost', 33333, 'tcp']],
        resource: [dispatch.resource[0]],
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
      name: "Jane",
      last: "Doe"
    }
  }).post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Forgetable'],
    body: {
      name: "John",
      last: "Doe"
    }
  }).post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Forgetable'],
    body: {
      name: "John",
      last: "Smith"
    }
  });
}, 1000);