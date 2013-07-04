var jstp  = require('jstp')
  , mongo = require('mongodb');

var Monje = {
  mongodb: mongo,
  jstp: jstp,
  mongoConnection: mongo,

  bind: function (argumentJstp) {
    if (argumentJstp) this.jstp = argumentJstp;

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
        method: 'PATCH',
        resource: ['*', '*', '*', '*']
      }}, Monje.patchNewborn, this)

      .on({ endpoint: {
        method: 'DELETE',
        resource: ['*']
      }}, Monje.deleteGrampa, this)

      .on({ endpoint: {
        method: 'DELETE',
        resource: ['*', '*']
      }}, Monje.deleteDad, this)

      .on({ endpoint: {
        method: 'DELETE',
        resource: ['*', '*', '*']
      }}, Monje.deleteNephew, this);

/*
      // This endpoint is not working and has been disabled
      .on({ endpoint: {
        method: 'DELETE',
        resource: ['*', '*', '*', '*']
      }}, Monje.deleteNewborn, this); */
    return this;
  },

  postGrampa: function (engine, answer, dispatch) {
    this._getCollection(dispatch, function (err, collection) {
      if (err) throw err;
      collection.insert(dispatch.body, function (err, record) {
        if (err) throw err;

        engine.answer(dispatch, 200, record[0]._id);

        engine.put({
          resource: [dispatch.resource[0], record[0]._id],
          body: record[0],
          referer: ['Monje']
        });

        dispatch = null;
      });
    });
  },

  postNephew: function (engine, answer, dispatch) {
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

  getGrampa: function (engine, answer, dispatch) {
    if (answer) return;
    this._getCollection(dispatch, function (err, collection) {
      if (err) throw err;
      if (dispatch.body.filters) {
        collection.find(dispatch.body.filters).toArray( function (err, items) {
          if (err) throw err;

          if (items.length > 0) {
            for (index in items) {
              Monje.jstp.put({
                referer: ['Monje'],
                resource: [dispatch.resource[0], items[index]._id],
                body: items[index]
              });
            }

            engine.answer(dispatch, 200, { amount: items.length });
          }

          else {
            engine.answer(dispatch, 404, { message: "Not Found" });
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

  getDad: function (engine, answer, dispatch) {
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

  getNephew: function (engine, answer, dispatch) {
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

  getNewborn: function (engine, answer, dispatch) {
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

  patchDad: function (engine, answer, dispatch) {
    if (this._notMonje(dispatch)) {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        if (dispatch.resource[1] == '*') {
          collection.find(dispatch.body.filters)
            .toArray(function (err, items) {
            if (err) throw err;
            if (items && items.length > 0) {          
              collection.update(
                dispatch.body.filters, 
                {$set: dispatch.body.data},
                {
                  journal: true,
                  multi: true
                }, 
                function (err, records) {
                if (err) throw err;
                
                for (index in items) {
                  Monje.jstp.patch({
                    referer: ['Monje'],
                    resource: [dispatch.resource[0], items[index]._id],
                    body: dispatch.body.data
                  });
                }

                dispatch = null;
                items = null;
              });
            }
            else {
              dispatch = null;
            }
          });
        }
        else {      
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
        }
      });
    }
  },

  patchNewborn: function (engine, answer, dispatch) {
    if (this._notMonje(dispatch)) {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        if (dispatch.resource[1] == '*') {
          var action = {}
          for (field in dispatch.body.data) { // Each property is a field to modify
            action[dispatch.resource[2] + "." + dispatch.resource[3] + "." + field] = dispatch.body.data[field];
          }
          collection.find(dispatch.body.filters).toArray( function (err, items) {
            if (err) throw err;

            if (items && items.length > 0) {
              collection.update(
                dispatch.body.filters,
                { $set: action },
                { 
                  journal: true,
                  multi: true
                }, 
                function (err, records) {
                if (err) throw err;

                for (index in items) {
                  Monje.jstp.patch({
                    referer: ['Monje'],
                    resource: [dispatch.resource[0], items[index]._id, dispatch.resource[2], dispatch.resource[3]],
                    body: dispatch.body.data
                  });
                }

                dispatch = null;
                items = null;
                action = null;
              });              
            }
          });
        }
        else {      
          var action = {}
          for (field in dispatch.body) { // Each property is a field to modify
            action[dispatch.resource[2] + "." + dispatch.resource[3] + "." + field] = dispatch.body[field];
          }

          collection.update(
            { _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, 
            { $set: action },
            {
              journal: true
            }, function (err, records) {
            if (err) throw err;

            if (records > 0) {
              Monje.jstp.patch({
                referer: ['Monje'],
                resource: dispatch.resource,
                body: dispatch.body
              });
            }

            dispatch = null;
            items = null;
            action = null;
          });
        }
      });      
    }
  },

  deleteGrampa: function (engine, answer, dispatch) {
    if (this._notMonje(dispatch)) {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        if (dispatch.body.filters) {
          collection.find( dispatch.body.filters).toArray( function (err, items) {
            if (err) throw err;          
            if (items && items.length > 0) {
              collection.remove( dispatch.body.filters, function (err, data) {
                if (err) throw err;
                for (index in items) {
                  Monje.jstp.delete({
                    referer: ['Monje'],
                    resource: [dispatch.resource[0], items[index]._id]
                  });
                }
                dispatch = null;
              });              
            }
          })
        }
        else {
          collection.remove( function (err, data) {
            if (err) throw err;
            Monje.jstp.delete({
              resource: [dispatch.resource[0]],
              referer: ['Monje']
            });
            dispatch = null;
          })
        }
      });              
    }
  },

  deleteDad: function (engine, answer, dispatch) {
    if (this._notMonje(dispatch)) {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        collection.remove({ _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, function (err, data) {
          if (err) throw err;
          Monje.jstp.delete({
            resource: dispatch.resource,
            referer: ['Monje']
          });

          dispatch = null;
        });
      })
    }
  },

  deleteNephew: function (engine, answer, dispatch) {
    if (this._notMonje(dispatch)) {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;

        var action = {}
        action[dispatch.resource[2]] = 1;
        if (dispatch.resource[1] == '*') {
          collection.find( dispatch.body.filters )
            .toArray( function (err, items) {
            if (err) throw err;

            collection.update(
              dispatch.body.filters,
              { $unset: action },
              {
                journal: true,
                multi: true
              },
              function (err, data) {
              if (err) throw err;   

              for (index in items) {
                Monje.jstp.delete({
                  referer: ['Monje'],
                  resource: [dispatch.resource[0], items[index]._id, dispatch.resource[2]]
                });
              }

              dispatch = null;
              items = null;
            });
          });
        }

        else {        
          collection.update(
            { _id: Monje.mongodb.ObjectID(dispatch.resource[1])},
            { $unset: action},
            { journal: true },
            function (err, data) {
            if (err) throw err;
            Monje.jstp.delete({
              referer: ['Monje'],
              resource: dispatch.resource
            });

            dispatch = null;
          });
        }
      });
    }
  },
  /*
  // This endpoint is not working, and has been disabled
  deleteNewborn: function (engine, answer, dispatch) {
    if (this._notMonje(dispatch)) {
      this._getCollection(dispatch, function (err, collection) {
        if (err) throw err;
        var action = {}
        action[dispatch.resource[2]] = parseInt(dispatch.resource[3]);
        console.log(action);
        collection.update(
          { _id: Monje.mongodb.ObjectID(dispatch.resource[1])}, 
          { $pull: action},
          {
            journal: true
          }, 
          function (err, data) {
          if (err) throw err;
          console.log(data); 
        });
      });
    }  
  }, */

  _getCollection: function(dispatch, callback) {
    if (!Monje.mongoConnection.collection) {
      return console.log("There is no connection to mongo in mongoConnection!");
    }
    Monje.mongoConnection.collection(dispatch.resource[0], callback);
  },

  _notMonje: function (dispatch) {
    return dispatch.referer[0] != 'Monje'
  }
}

module.exports = Monje;