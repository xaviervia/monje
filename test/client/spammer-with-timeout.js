var monje = require('../../index.js');

var Article = {
  bindDad: function (engine, answer, dispatch) {
    monje.jstp.post({
      host: [['localhost', 33333, 'tcp']],
      resource: ['Article', '*', 'comments'],
      body: {
        filters: { tag: 'spamable' },
        data: "SPAM SPAM SPAM"
      }
    });
  },

  bindSon: function (engine, answer, dispatch) {
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
      title: "This articles are just there for the only purpose of being spammed upon",
      tag: 'spamable',
      comments: []
    }
  })

  setTimeout( function () {
    monje.jstp.post({
      host: [['localhost', 33333, 'tcp']],
      resource: ['Article'],
      body: {
        title: "This should also be spammed",
        tag: 'spamable',
        comments: []
      }
    });

    setTimeout( function () {
      monje.jstp.post({
        host: [['localhost', 33333, 'tcp']],
        resource: ['Article'],
        body: {
          title: "And this, why not?",
          tag: 'spamable',
          comments: []
        }
      });
    }, 100);
  }, 100);
}, 1000);