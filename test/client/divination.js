var monje = require('../../index.js');


var first = true;
var Magic = {
  bind: function (dispatch) {  
    if (first)
      monje.jstp.get({
        host: [['localhost', 33333, 'tcp']],      
        resource: ['Magic', '*', 'children', '1'],
        body: { filters: { professor: 'Flitwick' } }
      });
    first = false;
  },

  bound: function (dispatch) {
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
        'Parvati Patil',
        'Dean Thomas'
      ]
    }
  }).post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Magic'],
    body: {
      professor: "Flitwick",
      asignature: "Enchantments",
      children: [
        'Draco Malfoy',
        'Percy Weasley'
      ]
    }
  });
}, 1000);
