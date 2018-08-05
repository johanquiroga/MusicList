import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addAlbum, albumSearchClear, searchAlbums } from '../../actions/albums';

import AlbumsPage from './AlbumsPage';

class AlbumsPageContainer extends React.Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(albumSearchClear());
  }

  render() {
    const {
      addAlbumFunction,
      albums,
      searchAlbumsFunction,
      user,
    } = this.props;

    return (
      <AlbumsPage
        addAlbumFunction={addAlbumFunction}
        albums={albums}
        searchAlbumsFunction={searchAlbumsFunction}
        user={user}
      />
    );
  }
}

const mapStateToProps = state => ({
  albums: state.albums,
  user: state.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addAlbumFunction: addAlbum,
  searchAlbumsFunction: searchAlbums,
  dispatch,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AlbumsPageContainer);
