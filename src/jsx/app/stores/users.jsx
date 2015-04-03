'use strict';

var Fluxxor = require('fluxxor');

//Events
var events = {

  GET_BY_ID: 'USERS:GET_BY_ID',
  GET_BY_ID_SUCCESS: 'USERS:GET_BY_ID_SUCCESS',
  GET_BY_ID_FAIL: 'USERS:GET_BY_ID_FAIL',

  GET_BY_EMAIL: 'USERS:GET_BY_EMAIL',
  GET_BY_EMAIL_SUCCESS: 'USERS:GET_BY_EMAIL_SUCCESS',
  GET_BY_EMAIL_FAIL: 'USERS:GET_BY_EMAIL_FAIL',

  GET_CREATIONS: 'USERS:GET_CREATIONS',
  GET_CREATIONS_SUCCESS: 'USERS:GET_CREATIONS_SUCCESS',
  GET_CREATIONS_FAIL: 'USERS:GET_CREATIONS_FAIL',

  GET_LIST: 'USERS:GET_LIST',
  GET_LIST_SUCCESS: 'USERS:GET_LIST_SUCCESS',
  GET_LIST_FAIL: 'USERS:GET_LIST_FAIL',

  RESET_STATE: 'USERS:RESET_STATE'

};

//Actions
var actions = {

  getById: function(data){
    var me = this;
    if(data){
      me.dispatch(events.GET_BY_ID, data);
      api.users.getById(data).then(function(result){
        if(result.id){
          me.dispatch(events.GET_BY_ID_SUCCESS, result);
        }
        else{
          me.dispatch(events.GET_BY_ID_FAIL, result);
        }
      }, function(err){
        me.dispatch(events.GET_BY_ID_FAIL, err);
      });
    }
  },

  getByEmail: function(data){
    var me = this;
    if(data){
      me.dispatch(events.GET_BY_EMAIL, data);
      api.users.getByEmail(data).then(function(result){
        me.dispatch(events.GET_BY_EMAIL_SUCCESS, result);
      }, function(err){
        me.dispatch(events.GET_BY_EMAIL_FAIL, err);
      });
    }
  },

  getCreations: function(data){
    var me = this;
    me.dispatch(events.GET_CREATIONS, data);
    api.users.getCreations(data).then(function(result){
      me.dispatch(events.GET_CREATIONS_SUCCESS, result);
    }, function(err){
      me.dispatch(events.GET_CREATIONS_FAIL, err);
    });
  },

  getList: function(following, time){
    var me = this;
    api.users.getList(following, time).then(function(result){
      me.dispatch(events.GET_LIST_SUCCESS, result);
    }, function(err){
      me.dispatch(events.GET_LIST_FAIL, err);
    });
    me.dispatch(events.GET_LIST, null);
  },

  resetState: function(){
    this.dispatch(events.RESET_STATE);
  }

};

//Store
var Store = Fluxxor.createStore({

  initialize: function(){
    var me = this;

    //Declare values
    me.user = null;
    me.users = null;
    me.creations = null;

    //Bind action handlers
    me.bindActions(
      events.GET_BY_ID, me.onGetById,
      events.GET_BY_ID_SUCCESS, me.onGetByIdSuccess,
      events.GET_BY_ID_FAIL, me.onGetByIdFail,
      events.GET_BY_EMAIL, me.onGetByEmail,
      events.GET_BY_EMAIL_SUCCESS, me.onGetByEmailSuccess,
      events.GET_BY_EMAIL_FAIL, me.onGetByEmailFail,
      events.GET_CREATIONS, me.onGetCreations,
      events.GET_CREATIONS_SUCCESS, me.onGetCreationsSuccess,
      events.GET_CREATIONS_FAIL, me.onGetCreationsFail,
      events.GET_LIST, me.onGetList,
      events.GET_LIST_SUCCESS, me.onGetListSuccess,
      events.GET_LIST_FAIL, me.onGetListFail,
      events.RESET_STATE, me.onResetState
    );

  },

  getState: function(){
    var me = this;
    return {
      user: me.user,
      users: me.users,
      creations: me.creations
    };
  },

  onResetState: function(){
    var me = this;
    me.user = null;
    me.users = null;
    me.creations = null;
    me.emit('change');
  },

  onGetById: function(data){
    var me = this; //Could show spinner here, but nbd
    me.emit('change');
  },

  onGetByIdSuccess: function(data){
    var me = this;
    me.user = data;
    me.emit('change');
  },

  onGetByIdFail: function(data){
    var me = this;
    me.user = null;
    me.emit('change');
  },

  onGetByEmail: function(data){
    var me = this;
    me.emit('change');
  },

  onGetByEmailSuccess: function(data){
    var me = this;
    me.user = data;
    me.emit('change');
  },

  onGetByEmailFail: function(data){
    var me = this;
    me.user = null;
    me.emit('change');
  },

  onGetCreations: function(data){
    var me = this;
    me.emit('change');
  },

  onGetCreationsSuccess: function(data){
    var me = this;
    me.creations = data;
    me.emit('change');
  },

  onGetCreationsFail: function(data){
    var me = this;
    me.creations = null;
    me.emit('change');
  },

  onGetList: function(data){
    var me = this;
    me.emit('change');
  },

  onGetListSuccess: function(data){
    var me = this;
    me.users = data;
    me.emit('change');
  },

  onGetListFail: function(data){
    var me = this;
    me.users = null;
    me.emit('change');
  }

});

module.exports = {
  actions: actions,
  events: events,
  store: new Store()
};
