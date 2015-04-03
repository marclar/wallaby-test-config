var Fluxxor = require('fluxxor');

var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Body = React.createClass({

  render: function() {

    return (
      <Container id='body'>
        <Grid>
          <Row>
            <Col sm={12}>
              <PanelContainer>
                <Panel>
                  <PanelBody className='text-center'>
                    <p>/src/jsx/app/routes/app/index.jsx</p>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
});

var Page = React.createClass({

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('auth', 'users'),
    SidebarMixin,
    ReactRouter.State
  ],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      auth: flux.store('auth').getState(),
      users: flux.store('users').getState()
    };
  },

  render: function() {
    var classes = React.addons.classSet({
      'container-open': this.state.open
    });

    var body = this.state.auth.admin ? <Body {...this.props}/> : <div>not logged in</div>;
    return (
      <Container id='container' className={classes}>
        <Sidebar {...this.props}/>
        <Header {...this.props}/>
        <Body {...this.props}/>
        <Footer />
      </Container>
    );
  }
});

module.exports = Page;
