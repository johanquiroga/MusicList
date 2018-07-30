import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, Label, Table } from 'reactstrap';

// helpers
const formatTitle = (discogsTitle, value) => discogsTitle.split('-')[value];
const formatGenre = discogsGenre => discogsGenre.join(', ');

class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    this.addAlbum = this.addAlbum.bind(this);
    this.createTable = this.createTable.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.listAlbums = this.listAlbums.bind(this);

    this.state = {
      searchText: '',
    };
  }

  handleSearchChange(e) {
    this.setState({
      searchText: e.target.value,
    });
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.handleValidSubmit();
    }
  }

  handleValidSubmit() {
    const { searchAlbumsFunction } = this.props;
    const formData = this.state;
    searchAlbumsFunction(formData.searchText);
  }

  createTable(albums) {
    return (
      <Table striped responsive>
        <thead>
          <tr>
            <th />
            <th>Title</th>
            <th>Artist</th>
            <th>Genre(s)</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {this.listAlbums(albums)}
        </tbody>
      </Table>
    );
  }

  listAlbums(albums) {
    return albums.map(album => (
      <tr key={album.id}>
        <td><img src={album.thumb} alt="album thumbnail" width="80" height="80" /></td>
        <td>{formatTitle(album.title, 1)}</td>
        <td>{formatTitle(album.title, 0)}</td>
        <td>{formatGenre(album.genre)}</td>
        <td>
          <Button color="primary" outline id={album.id} onClick={this.addAlbum}>
            Add To My List
          </Button>
        </td>
      </tr>
    ));
  }

  addAlbum(e) {
    const { addAlbumFunction } = this.props;
    addAlbumFunction(e.target.id);
  }

  render() {
    const { albums } = this.props;

    return (
      <div>
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            <AvForm onValidSubmit={this.handleValidSubmit}>
              <AvGroup>
                <h2><Label for="search">Search Albums</Label></h2>
                <p>
                  Find albums you own and add them to your MusicList.
                  You can search by album title or artist name.
                </p>
                <AvInput
                  id="search"
                  name="search"
                  onChange={this.handleSearchChange}
                  onKeyPress={this.handleKeyPress}
                  placeholder="Queens of the Stone Age"
                  required
                  type="text"
                  value={this.state.searchText}
                />
                <AvFeedback>Required</AvFeedback>
              </AvGroup>
              <Button color="primary">Search Albums</Button>
            </AvForm>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-12">
            {albums && albums.length > 0 ? <h2>Albums</h2> : null}
            <div className="row">
              <div className="col-sm-12 col-lg-12">
                {albums && albums.length > 0 ? this.createTable(albums) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AlbumsPage;