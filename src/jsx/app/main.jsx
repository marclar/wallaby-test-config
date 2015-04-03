'use strict';

//Add log shortcuts
window.log = function(){console.log.apply(console, arguments);};
window.jlog = function(obj){console.log.call(console, JSON.stringify(obj, 0, 2));};

/* Initialize Locales */
l20n.initializeLocales('app', {
  'locales': ['en-US'],
  'default': 'en-US'
});

/* Initializing touch events */
React.initializeTouchEvents(true);

require('./preloader.jsx');

var routes = require('./routes.jsx');

var flux = require('./flux.jsx');

window.api = require('./api.jsx');


Pace.once('hide', function() {
  $('#pace-loader').removeClass('pace-big').addClass('pace-small');
});

var InitializeRouter = function(View) {
  // cleanup
  if(window.Rubix) window.Rubix.Cleanup();
  //Pace.restart();
  if(window.hasOwnProperty('ga') && typeof window.ga === 'function') {
    window.ga('send', 'pageview', {
     'page': window.location.pathname + window.location.search  + window.location.hash
    });
  }

  React.render(<View flux={flux} />, document.getElementById('app-container'), function() {
    // l20n initialized only after everything is rendered/updated

    //Set messenger options
    Messenger.options = {theme: 'flat'};

    l20n.ready();
    setTimeout(function() {
      $('body').removeClass('fade-out');
    }, 500);
  });
};

if(Modernizr.history)
  ReactRouter.run(routes, ReactRouter.HistoryLocation, InitializeRouter);
else
  ReactRouter.run(routes, InitializeRouter);
