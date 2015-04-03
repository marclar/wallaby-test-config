'use strict';

var Fluxxor = require('fluxxor');

//Events
var events = {

  LOGIN: 'AUTH:LOGIN',
  LOGIN_SUCCESS: 'AUTH:LOGIN_SUCCESS',
  LOGIN_FAIL: 'AUTH:LOGIN_FAIL',
  LOGOUT: 'AUTH:LOGOUT',
  GET_USER: 'AUTH:GET_USER',
  SET_USER: 'AUTH:SET_USER',
  SET_STATUS: 'AUTH:SET_STATUS'

};

//Actions
var actions = {

  login: function(data){
    var me = this;
    me.dispatch(events.LOGIN, data);

    api.auth.login(data.email, data.pass).then(function(result){
      localStorage['email'] = data.email;
      localStorage['pass'] = data.pass;
      me.dispatch(events.LOGIN_SUCCESS, result);
    }, function(err){
      me.dispatch(events.LOGIN_FAIL, err);
    });

  },

  getStoredCredentials: function(){
    return {
      email: localStorage['email'],
      pass: localStorage['pass']
    };
  },

  logout: function(data){
    var me = this;
    api.auth.logout();
    delete localStorage['email'];
    delete localStorage['pass'];
    me.dispatch(events.LOGOUT, data);
  },

  setStatus: function(data){
    this.dispatch(events.SET_STATUS, data);
  }

};

//Store
var Store = Fluxxor.createStore({

  initialize: function(){
    var me = this;

    //Declare values
    me.status = null;
    me.admin = null;

    //Bind action handlers
    me.bindActions(
      events.LOGIN, me.onLogin,
      events.LOGIN_SUCCESS, me.onLoginSuccess,
      events.LOGIN_FAIL, me.onLoginFail,
      events.LOGOUT, me.onLogout,
      events.SET_STATUS, me.onSetStatus
    );

  },

  getState: function(){
    var me = this;
    return {
      status: me.status,
      admin: me.admin
    };
  },

  onLogin: function(data){
    var me = this;
    //Could show spinner here, but nbd
    me.emit('change');
  },

  onLoginSuccess: function(data){
    var me = this;
    me.status = null;
    me.admin = data;
    me.emit('change');
  },

  onLoginFail: function(err){
    var me = this;
    me.admin = null;
    me.status = {type: 'error', message: 'Login failed.'};
    me.emit('change');
  },

  onLogout: function(){
    var me = this;
    me.admin = null;
    this.emit('change');
  },

  onSetStatus: function(data){
    this.status = data || null;
    this.emit('change');
  }

});

module.exports = {
  actions: actions,
  events: events,
  store: new Store()
};
