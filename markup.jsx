var fs = require('fs');
var path = require('path');
var package = require('./package.json');
var ReactRouter = require('react-router');

function markup(appName, filename, webpack_host, webpack_dev_server_port){

  //Get the html
  this.html = fs.readFileSync(path.join(process.cwd(), 'src', 'jsx', appName, filename), {
    encoding: 'utf8'
  });

  //Get the stylesheets
  var css = stylesheets(appName);

  //Replace the appscript tag
  this.html = this.html.replace(new RegExp('{appscript}', 'g'), appscript(appName, webpack_host, webpack_dev_server_port));

  //Replace other tokens
  this.html = this.html.replace(new RegExp('{app}', 'g'), appName);
  this.html = this.html.replace(new RegExp('{stylesheets}', 'g'), css);
  this.html = this.html.replace(new RegExp('{version}', 'g'), package.version);

  //Set LTR / RTL values
  this.ltr = this.html.replace(new RegExp('{dir}', 'g'), 'ltr');
  this.rtl = this.html.replace(new RegExp('{dir}', 'g'), 'rtl');

  //Set the routes
  this.routes = require('./src/jsx/'+appName+'/routes.jsx');

}

//Render method called in an Express route
markup.prototype.render = function(req, res, cb){
  var me = this;
  var router = ReactRouter.create({
    routes: me.routes,
    location: req.url,
    onAbort: function(redirect) {
      cb({redirect: redirect});
    },
    onError: function(err) {
      console.log(err);
    }
  });
  router.run(function(Handler, state) {
    if(state.routes[0].name === 'not-found') {
      cb({notFound: true}, React.renderToStaticMarkup(<Handler/>));
      return;
    }
    cb(null, React.renderToStaticMarkup(<Handler/>));
  });
};

//Helpers ------------------------------------------------------------
function style(file, media){
  media = media || 'screen';
  return "    <link media='"+media+"' rel='stylesheet' type='text/css' href='"+file+"'>\n";
}

function stylesheets(appName){
  var stylesheets = '';
  if(process.env.NODE_ENV === 'development') {
    stylesheets += style('/css/'+appName+'/raw/{dir}/main.css', 'screen,print');
    stylesheets += style('/css/'+appName+'/raw/{dir}/theme.css');
    stylesheets += style('/css/'+appName+'/raw/{dir}/colors.css');
    stylesheets += style('/css/'+appName+'/raw/{dir}/font-faces.css');
  } else {
    stylesheets += style('/css/'+appName+'/blessed/{dir}/main-blessed1.css', 'screen,print');
    stylesheets += style('/css/'+appName+'/blessed/{dir}/main.css', 'screen,print');
    stylesheets += style('/css/'+appName+'/blessed/{dir}/theme.css');
    stylesheets += style('/css/'+appName+'/blessed/{dir}/colors-blessed1.css');
    stylesheets += style('/css/'+appName+'/blessed/{dir}/colors.css');
    stylesheets += style('/css/'+appName+'/blessed/{dir}/font-faces.css');
  }
  return stylesheets;
};

function appscript(appName, webpack_host, webpack_dev_server_port){
  if(process.env.NODE_ENV === 'development') {
    return 'http://'+webpack_host+':'+webpack_dev_server_port+'/scripts/bundle.js';
  } else {
    return '/js/'+appName+'/'+appName+'.js';
  }
}

module.exports = markup;
