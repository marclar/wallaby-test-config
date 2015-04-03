'use strict';

var Fluxxor = require('fluxxor');

//Get stores & actions
var auth = require('./stores/auth.jsx');
var users = require('./stores/users.jsx');

//Build Fluxxor instance
var flux = new Fluxxor.Flux({
  auth: auth.store,
  users: users.store
}, {
  auth: auth.actions,
  users: users.actions
});

//Batch updates (via http://goo.gl/BeRjm7)
var oldDispatch = flux.dispatcher.dispatch.bind(flux.dispatcher);
flux.dispatcher.dispatch = function(action) {
  React.addons.batchedUpdates(function() {
    oldDispatch(action);
  });
};

//Log events
flux.on('dispatch', function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});


module.exports = flux;
