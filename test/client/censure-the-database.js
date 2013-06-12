var monje = require('../../index.js');

var Article = {
  bind: function (dispatch) {
    console.log(dispatch.body);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'DELETE',
    resource: ['Article', '*']
  }
}, Article.bind, Article);


setTimeout( function () {
  monje.jstp.delete({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Article']
  });
}, 1000);