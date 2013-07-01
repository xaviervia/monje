var monje = require('../../index.js');

monje.jstp.delete({
  host: [['localhost', 33333, 'tcp']],
  resource: ['Meal']
});

var Meal = {
  bind: function (engine, answer, dispatch) {
    monje.jstp.patch({
      host: [['localhost', 33333, 'tcp']],
      resource: ['Meal', dispatch.resource[1], 'variations', '1'],
      body: {
        tastiness: 5
      }
    });
  },

  nephew: function (engine, answer, dispatch) {
    console.log(dispatch.body);
  }
}

monje.jstp.bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PUT',
    resource: ['Meal', '*']
  }
}, Meal.bind, Meal).bind({
  host: [['localhost', 33333, 'tcp']],
  endpoint: {
    method: 'PATCH',
    resource: ['Meal', '*', '*', '*']
  }
}, Meal.nephew, Meal);


setTimeout( function () {
  monje.jstp.post({
    host: [['localhost', 33333, 'tcp']],
    resource: ['Meal'],
    body: {
      name: "Tomatoes",
      healthiness: 9,
      variations: [
        {type: "sauce", tastiness: 6},
        {type: "salad", tastiness: 8},
        {type: "raw", tastiness: 3}
      ]
    }
  });
}, 1000);