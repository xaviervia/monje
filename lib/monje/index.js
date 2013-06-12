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
        action[dispatch.resource[2]] = dispatch.body;
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
      });

    }
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
    this.mongoConnection.collection(dispatch.resource[0], callback);
  },

  _notMonje: function (dispatch) {
    return dispatch.referer[0] != 'Monje'
  }
}

module.exports = Monje;