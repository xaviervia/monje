var monje = require('../../index.js');

var Magic = {
  bind: function (engine, answer, dispatch) {  
    monje.jstp.get({
      host: [['localhost', 33333, 'tcp']],      
      resource: ['Magic', dispatch.resource[1], 'children', '0'],
    });
  },

  bound: function (engine, answer, dispatch) {
    console.log("The child is: " + dispatch.body);
  }
}

monje.jstp.delete({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Magic']
});

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Magic', '*']
  }
}, Magic.bind, Magic);

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Magic', '*', '*', '*']
  }
}, Magic.bound, Magic);


setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Magic'],
    body: {
      professor: "Trelawney",
      asignature: "Divination",
      children: [
        'Ron Weasley',
        'Harry Potter'
      ]
    }
  }).post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Magic'],
    body: {
      professor: "McGonagall",
      asignature: "Transfiguration",
      children: [
        'Hermione Granger',
        'Harry Potter'
      ]
    }
  });
}, 1000);
