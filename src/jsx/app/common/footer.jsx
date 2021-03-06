var Footer = React.createClass({
  getInitialState: function() {
    return {
      version: 0
    };
  },
  componentDidMount: function() {
    this.setState({
      version: document.getElementsByTagName('body')[0].getAttribute('data-version')
    });
  },
  render: function() {
    return (
      <div id='footer-container'>
        <Grid id='footer' className='text-center'>
          <Row>
            <Col xs={12}>
              <div>/src/jsx/app/common/footer.jsx</div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

module.exports = Footer;
