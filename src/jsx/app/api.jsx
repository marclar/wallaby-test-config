'use strict';

function Api(){
  var me = this;

  var baseUrl = (function() {
    var apiURLParam = null /*utils.getParameterByName('apiURL')*/,
      stagingURL = 'https://staging-api.domain.com',
      productionURL = 'https://production-api.domain.com';

    if (apiURLParam) {
      return apiURLParam;
    } else if (window.location.origin === 'https://www.domain.com') {
      return productionURL;
    } else {
      return stagingURL;
    }
  })();

  //Set up xdomain
  (function(baseUrl, proxy){
    var slaves = {};
    slaves[baseUrl] = proxy;
    xdomain.slaves(slaves);
  })(baseUrl, '/proxy.html?origin=' + location.origin);

  //Define API urls
  me.urls = {

    me: _.template(baseUrl + '/me'),

    users: {
      getById: _.template(baseUrl + '/users/${userId}/?as=${userId}'),
      getByEmail: _.template(baseUrl + '/users?email=${email}'),
      getCreations: _.template(baseUrl + '/users/${userId}/creations?count=50&include=promoters*10,flags*10,sources*1&sort=time'),
      getList: _.template(baseUrl + '/users?count=50&sort=time&following=${following}&time=${time}')
    }

  };

  //Auth ------------------------------------------------
  me.auth = {

    login: function(email, pass){
      $.ajaxSetup({headers: {Authorization: 'Basic ' + btoa(email + ':' + pass)}});
      return $.ajax({url: me.urls.me()});
    }.bind(me),

    logout: function(){
      $.ajaxSetup({headers: {Authorization: 'None'}});
    }.bind(me)

  };

  //Users ------------------------------------------------
  me.users = {

    getById: function(userId){
      return $.ajax({url: me.urls.users.getById({userId: userId})});
    }.bind(me),

    getByEmail: function(email){
      return $.ajax({url: me.urls.users.getByEmail({email: encodeURIComponent(email)})});
    }.bind(me),

    getCreations: function(userId){
      return $.ajax({url: me.urls.users.getCreations({userId: userId})});
    }.bind(me),

    getList: function(following, time){
      return $.ajax({url: me.urls.users.getList({following: following, time: time})});
    }.bind(me)

  }

}


module.exports = new Api();
