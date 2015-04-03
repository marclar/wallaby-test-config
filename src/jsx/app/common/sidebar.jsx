var Fluxxor = require('fluxxor');

var ApplicationSidebar = React.createClass({
  render: function() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-header'>/src/jsx/app/common/sidebar.jsx</div>
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}}>

                  <SidebarNavItem href='/' glyph='icon-fontello-user-2' name='Home' />

                  <SidebarNavItem glyph='icon-fontello-gauge' name='Blank' href='/blank' />

                </SidebarNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});


var SidebarSection = React.createClass({

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('users'),
    SidebarMixin,
    ReactRouter.State
  ],

  componentDidMount: function(){
    var me = this;
    var flux = me.getFlux();
    var usersState = flux.store('users').getState();
    if(!usersState.user){
      flux.actions.users.getById(me.getParams().userId);
    }
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var authState = flux.store('auth').getState();
    var usersState = flux.store('users').getState();
    return {
      admin: authState.admin,
      user: usersState.user
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getStateFromFlux());
  },

  render: function() {
    return (
      <div id='sidebar' {...this.props}>
        <div id='sidebar-container'>
          <Sidebar sidebar={0} active>
            <ApplicationSidebar />
          </Sidebar>
        </div>
      </div>
    );

  }
});

module.exports = SidebarSection;
