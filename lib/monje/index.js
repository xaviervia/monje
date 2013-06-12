var jstp  = require('node-jstp')
  , mongo = require('mongodb');

var Monje = {
  mongodb: mongo,
  jstp: jstp,
  mongoConnection: mongo,

  bind: function () {
    this.jstp

      // POSTing
      .on({ endpoint: {
        method: 'POST',
        resource: ['*']
      }}, Monje.postGrampa, this)
      
      .on({ endpoint: {
        method: 'POST',
        resource: ['*', '*', '*']
      }}, Monje.postNephew, this)

      .on({ endpoint: {
        method: 'GET',
        resource: ['*']
      }}, Monje.getGrampa, this)

      .on({ endpoint: {
        method: 'GET',
        resource: ['*', '*']
      }}, Monje.getDad, this)

      .on({ endpoint: {
        method: 'GET',
        resource: ['*', '*', '*']
      }}, Monje.getNephew, this)

      .on({ endpoint: {
        method: 'GET',
        resource: ['*', '*', '*', '*']
      }}, Monje.getNewborn, this)

      .on({ endpoint: {
        method: 'PATCH',
        resource: ['*', '*']
      }}, Monje.patchDad, this)

      .on({ endpoint: {
          method: 'DELETE',
          resource: ['*']
      }}, Monje.deleteGrampa, this);
    return this;
  },

  postGrampa: function (dispatch) {
    this._getCollection(dispatch, function (err, collection) {
      if (err) throw err;
      collection.insert(dispatch.body, function (err, record) {
        if (err) throw err;

        Monje.jstp.put({
          resource: [dispatch.resource[0], record[0]._id],
          body: record[0],
          referer: ['Monje']
        });

        dispatch = null;
      });
    });
  },

  postNephew: function (dispatch) {
    if (this._notMonje(dispatch)) {

      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        var action = {};
        action[dispatch.resource[2]] = dispatch.body.data;
       
        if (dispatch.resource[1] != '*') {      
          collection.update(
            { _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, 
            { $push: action}, 
            {
              journal: true,
              multi: true
            }, function (err, data) {
            if (err) throw err;
            
            Monje.jstp.post({
              referer: ['Monje'],
              resource: dispatch.resource,
              body: dispatch.body
            });

            action = null;
            dispatch = null;
          });
        }

        else {
          collection.find(dispatch.body.filters)
            .toArray( function (err, items) {
            if (err) throw err;

            if (items && items.length > 0) {
              collection.update(dispatch.body.filters, {$push: action},
                {
                  journal: true,
                  multi: true
                }, function (err, data) {
                if (err) throw err;
                
                for (index in items) {
                  Monje.jstp.post({
                    referer: ['Monje'],
                    resource: [dispatch.resource[0], items[index]._id, dispatch.resource[2]],
                    body: dispatch.body.data
                  });                  
                }

                items = null;
                action = null;
                dispatch = null;
              });
            }
          });
        }
      });
    }
  },

  getGrampa: function (dispatch) {
    this._getCollection(dispatch, function (err, collection) {
      if (err) throw err;
      if (dispatch.body.filters) {
        collection.find(dispatch.body.filters).toArray( function (err, items) {
          if (err) throw err;

          for (index in items) {
            Monje.jstp.put({
              referer: ['Monje'],
              resource: [dispatch.resource[0], items[index]._id],
              body: items[index]
            });
          }

          dispatch = null;
        });  
      }

      else {    
        collection.find().toArray( function (err, items) {
          if (err) throw err;

          for (index in items) {
            Monje.jstp.put({
              referer: ['Monje'],
              resource: [dispatch.resource[0], items[index]._id],
              body: items[index]
            });
          }

          dispatch = null;
        });
      }
    });
  },

  getDad: function (dispatch) {
    this._getCollection(dispatch, function (err, collection) {
      if (err) throw err;
      collection.findOne({ _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, function (err, item) {
        if (err) throw err;

        if (item) {
          Monje.jstp.put({
            referer: ['Monje'],
            resource: dispatch.resource,
            body: item
          });
        }

        dispatch = null;
      });
    });
  },

  getNephew: function (dispatch) {
    if (dispatch.resource[1] == '*') {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        collection.find(dispatch.body.filters).toArray( function (err, items) {
          if (err) throw err;
          if (items && items.length > 0) {
            for (index in items) {
              Monje.jstp.put({
                referer: ['Monje'],
                resource: [dispatch.resource[0], items[index]._id, dispatch.resource[2]],
                body: items[index][dispatch.resource[2]]
              });
            }
          }

          dispatch = null;
        });
      })
    }
    else {      
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        collection.findOne({ _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, function (err, item) {
          if (err) throw err;
          if (item && item[dispatch.resource[2]]) {
            Monje.jstp.put({
              referer: ['Monje'],
              resource: dispatch.resource,
              body: item[dispatch.resource[2]]
            });
          }

          dispatch = null;
        });
      });
    }
  },

  getNewborn: function (dispatch) {
    if (dispatch.resource[1] == '*') {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        collection.find(dispatch.body.filters).toArray( function (err, items) {
          if (err) throw err;
          var position = parseInt(dispatch.resource[3]);
          if (items && items.length > 0) {
            for (index in items) {
              if (
                items[index][dispatch.resource[2]] &&
                items[index][dispatch.resource[2]].length &&
                items[index][dispatch.resource[2]].length > position) {
                Monje.jstp.put({
                  referer: ['Monje'],
                  resource: [dispatch.resource[0], items[index]._id, dispatch.resource[2], dispatch.resource[3]],
                  body: items[index][dispatch.resource[2]][position]
                });
              }
            }
          }
          dispatch = null;
        })
      })
    }
    else {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        collection.findOne({ _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, function (err, item) {
          if (err) throw err;
          var position = parseInt(dispatch.resource[3]);
          if (
            item && // There is the item
            item[dispatch.resource[2]] && // The item has the property
            item[dispatch.resource[2]].length && // The property is an array of sorts
            item[dispatch.resource[2]].length > position) { // The array has enough items
            Monje.jstp.put({
              referer: ['Monje'],
              resource: dispatch.resource,
              body: item[dispatch.resource[2]][position]
            });

          }
          dispatch = null;
        });
      });      
    }
  },

  patchDad: function (dispatch) {
    this._getCollection(dispatch, function (err, collection) {
      if (err) throw err;
      collection.update(
        { _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, 
        { $set: dispatch.body},
        { journal: true}, function (err, affectedAmount) {
        if (err) throw err;
        collection.findOne( { _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, function (err, item) {
          if (err) throw err;
          if (item) {
            Monje.jstp.put({
              referer: ['Monje'],
              resource: dispatch.resource,
              body: item
            });
          }
          dispatch = null;
        });
      });
    })
  },

  deleteGrampa: function (dispatch) {
    if (this._notMonje(dispatch)) {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        collection.remove( function (err, data) {
          if (err) throw err;
          Monje.jstp.delete({
            resource: [dispatch.resource[0]],
            referer: ['Monje']
          });
          dispatch = null;
        })
      });      
    }
  },

  _getCollection: function(dispatch, callback) {
    Monje.mongoConnection.collection(dispatch.resource[0], callback);
  },

  _notMonje: function (dispatch) {
    return dispatch.referer[0] != 'Monje'
  }
}

module.exports = Monje;