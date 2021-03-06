import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addArtist, artistSearchClear, searchArtists } from '../../actions/artists';

import ArtistsPage from './ArtistsPage';

class ArtistsPageContainer extends React.Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(artistSearchClear());
  }

  render() {
    const {
      addArtistFunction,
      authentication,
      artists,
      searchArtistsFunction,
      user,
    } = this.props;

    return (
      <ArtistsPage
        addArtistFunction={addArtistFunction}
        artists={artists}
        authentication={authentication}
        searchArtistsFunction={searchArtistsFunction}
        user={user}
      />
    );
  }
}

const mapStateToProps = state => ({
  authentication: state.authentication,
  artists: state.artists,
  user: state.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addArtistFunction: addArtist,
  searchArtistsFunction: searchArtists,
  dispatch,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArtistsPageContainer);
