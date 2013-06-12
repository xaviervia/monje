var monje = require('../../index.js');

var Article = {
  bindDad: function (dispatch) {
    monje.jstp.post({
      host: [['localhost', 33333, 'tcp']],
      resource: ['Article', dispatch.resource[1], 'comments'],
      body: "Dogs are best"
    });
  },

  bindSon: function (dispatch) {
    if (dispatch.referer[0] == 'Monje') console.log(dispatch);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Article', '*']
  }
}, Article.bindDad, Article)
.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'POST',
    resource: ['Article', '*', '*']
  }
}, Article.bindSon, Article);



setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Article'],
    body: {
      title: "Lol! Cats",
      comments: []
    }
  });
}, 1000);