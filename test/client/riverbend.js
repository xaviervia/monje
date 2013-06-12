var monje = require('../../index.js');

var Castle = {
  bound: function (dispatch) {
    console.log("They say: " + dispatch.body);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Castle', '*', '*']
  }
}, Castle.bound, Castle);

monje.jstp.post({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Castle'],
  body: {
    name: "Pyke",
    house: "Greyjoy",
    words: "We do not sow"
  }
}).post({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Castle'],
  body: {
    name: "Riverrun",
    house: "Tully",
    words: "Family, Duty, Honor"
  }
});

setTimeout( function () {
  monje.jstp.get({
    host: [['localhost', 33333, 'tcp']],      
    resource: ['Castle', '*', 'words'],
    body: { filters: { house: 'Tully' }}
  }, Castle.bind, Castle);
}, 1000);
