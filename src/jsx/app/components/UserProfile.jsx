var ProfilePicture = require('./ProfilePicture.jsx');
var FollowButton = require('./FollowButton.jsx');

var UserProfile = React.createClass({
  render: function() {
    return (
      <div>
        <ProfilePicture username={this.props.username} />
        <FollowButton username={this.props.username} />
      </div>
    );
  }
});

module.exports = UserProfile;