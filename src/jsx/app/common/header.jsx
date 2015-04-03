var Fluxxor = require('fluxxor');

var Brand = React.createClass({
  render: function() {
    return (
      <NavHeader {...this.props}>
        <NavBrand tabIndex='-1'>
          /src/jsx/app/common/header.jsx
        </NavBrand>
      </NavHeader>
    );
  }
});

var Navigation = React.createClass({
  mixins: [ReactRouter.State, ReactRouter.Navigation],
  render: function() {
    var props = React.mergeProps({
      className: 'pull-right'
    }, this.props);
    return (
      <Login {...this.props}/>
    );
  }
});

var Login = React.createClass({

  getInitialState: function(){
    return {
      email: 'mk@fiftythree.com',
      pass: ''
    };
  },

  componentWillUpdate: function(props, state){
    //console.log('Login.componentWillUpdate()', props, state);
  },

  onEmailChange: function(e){
    this.setState({email: e.target.value});
  },

  onPassChange: function(e){
    this.setState({pass: e.target.value});
  },

  onLogin: function(e){
    this.props.onLogin(this.state);
    e.preventDefault();
  },

  onLogout: function(e){
    this.props.onLogout();
    e.preventDefault();
  },

  render: function() {
    if(true || this.props.admin){
      return (
        <NavContent className='pull-right'>
          <Nav>
            <NavItem>
              <a href='#' title="Log out" onClick={this.onLogout}>
                <Icon glyph='icon-fontello-logout-1' className='fg-theme' style={{lineHeight: 1, fontSize: 24 }} />
              </a>
            </NavItem>
          </Nav>
        </NavContent>
      );
    }
    else{
      return (
        <Form onSubmit={this.onLogin}>
          <NavContent className='pull-right'>
            <Nav>
              <NavItem divider />
              <NavItem>
                <Input autoFocus type='email' onChange={this.onEmailChange} placeholder='Email address' style={{marginTop: 24 }} />
              </NavItem>
              <NavItem divider />
              <NavItem>
                <Input type='password' onChange={this.onPassChange} placeholder='Password'  style={{marginTop: 24 }}  />
              </NavItem>
              <NavItem>
                <a href='#' title="Log out" onClick={this.onLogin}>
                  <Icon glyph='icon-fontello-login-1' className='fg-theme' style={{lineHeight: 1, fontSize: 24 }} />
                </a>
              </NavItem>
            </Nav>
          </NavContent>
        </Form>
      );
    }
  }

});

var Header = React.createClass({

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('auth'),
    SidebarMixin,
    ReactRouter.Navigation,
    ReactRouter.State
  ],

  componentDidMount: function(){
    var me = this;
    var flux = me.getFlux();
    var authState = flux.store('auth').getState();

    //If there's no admin,
    if(!authState.admin){
      console.log('Try to auto-login');
    }

  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var params = this.getParams();
    var authState = flux.store('auth').getState();

    //console.log('`auth` store: ', flux.store('auth'));
    //console.log('`flux` actions: ', flux.actions);
    //console.log('args', Array.prototype.slice.call(arguments));

    //If authState.status exists, show a message
    if(authState.status){
      Messenger({extraClasses: 'messenger-fixed messenger-on-top messenger-on-right'}).post({
        //id: 'error',
        type: authState.status.type,
        singleton: true,
        hideAfter: 2,
        showCloseButton: true,
        message: authState.status.message
      });
      setTimeout(function(){
        flux.actions.auth.setStatus();
      }, 2000);
    }

    //console.info('this.getFlux().actions', this.getFlux().actions);
    return {
      admin: authState.admin,
      status: authState.status
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getStateFromFlux());
  },

  onLogin: function(data){
    var flux = this.getFlux();
    flux.actions.auth.login(data);
  },

  onLogout: function(){
    var me = this;
    var flux = this.getFlux();
    flux.actions.auth.logout();
    if(me.isMounted()){
      me.transitionTo('blank');
    }
  },

  render: function() {
    return (
      <Grid {...this.props} id='navbar'>
        <Row>
          <Col xs={12}>
            <NavBar fixedTop id='rubix-nav-header'>
              <Container fluid>
                <Row>
                  <Col xs={3} visible='xs'>
                    <SidebarBtn />
                  </Col>
                  <Col xs={6} sm={4}>
                    <Brand />
                  </Col>
                  <Col xs={3} sm={8}>
                    <Navigation admin={this.state.admin} onLogin={this.onLogin} onLogout={this.onLogout} pressed={this.props.pressed} />
                  </Col>
                </Row>
              </Container>
            </NavBar>
          </Col>
        </Row>
      </Grid>
    );
  }
});

module.exports = Header;
