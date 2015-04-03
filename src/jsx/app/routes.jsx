/* ERROR PAGES */
var notfound = require('./routes/notfound.jsx');

/* APP PAGES */
var index = require('./routes/app/index.jsx');
var blank = require('./routes/app/blank.jsx');

/* ROUTES */
module.exports = (
  <Route handler={ReactRouter.RouteHandler}>
    <DefaultRoute name='home' handler={index} />
    <Route name='blank' path='/blank' handler={blank} />
    <Route name='login' path='/login' handler={blank} />
    <NotFoundRoute name='404' handler={notfound} />
  </Route>
);
