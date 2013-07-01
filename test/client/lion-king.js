var monje = require('../../index.js');

var Castle = {
  bind: function (engine, answer, dispatch) {
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
    name: "Harrenhall",
    house: "Lannister",
    words: "Hear me roar"
  }  
}).post({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Castle'],
  body: {
    name: "King's Landing",
    house: "Targaryen",
    words: "Fire and blood"
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
      resource: ['Castle'],
      body: {
        filters: { house: 'Lannister' }
      }
    }, Castle.bind, Castle);
  }, 100);
}, 1000);