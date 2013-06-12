var monje = require('../../index.js');

var Castle = {
  bind: function (dispatch) {
    console.log("The " + dispatch.body.house + " in " + dispatch.body.name + " says: " + dispatch.body.words);
  }
}

monje.jstp.post({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Castle'],
  body: {
    name: "Casterly Rock",
    house: "Lannister",
    words: "Hear me roar"
  }
})
.post({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Castle'],
  body: {
    name: "Dragonstone",
    house: "Baratheon",
    words: "Ours is the fury"
  }  
}).post({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Castle'],
  body: {
    name: "Highgarden",
    house: "Tyrell",
    words: "Growing strong"
  }  
});



setTimeout( function () {
  monje.jstp.bind({
    host: [['localhost', 33333, 'tcp']],
    endpoint: {
      method: 'PUT',
      resource: ['Castle', '*']
    }
  }, Castle.bind, Castle);

  setTimeout( function () {
    monje.jstp.get({
      host: [['localhost', 33333, 'tcp']],      
      resource: ['Castle']
    }, Castle.bind, Castle);
  }, 100);
}, 1000);