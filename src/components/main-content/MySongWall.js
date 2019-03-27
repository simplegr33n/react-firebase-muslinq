import React, { Component } from 'react';
import '../../styles/main-content.css';
import Firebase from '../../config/firebaseConfig.js'

import MySongListItem from '../list-items/MySongListItem.js'


class MySongWall extends Component {

	constructor(props) {
		super(props);
		this.state = {
			UID: this.props.UID,
			songs: []
		};

		this.firebase = new Firebase()
		this.getSongs()
	}

	getSongs = () => {
		// Posts branch of tree
		var ref = this.firebase.db.ref().child('user-songs').child(this.state.UID);

		ref.on('child_added', snapshot => {
			const previousSongs = this.state.songs;
			previousSongs.push({
				songName: snapshot.val().songName,
				artist: snapshot.val().artist,
				recorded: snapshot.val().recorded,
				info: snapshot.val().info,
				uploader: snapshot.val().uploader,
				uploaderName: snapshot.val().uploaderName,
				uploaded: snapshot.val().uploaded,
				published: snapshot.val().published,
				id: snapshot.val().id,
				songLength: '3:33' // Placeholder
			});
			this.setState({
				songs: previousSongs
			});
		});
	}

	render() {
		return (
			<div>
				<div id="MySongWall-Add-Song-Btns">
					<button id="MySongWall-Upload-Btn">Upload File</button>
					<button id="MySongWall-Record-Btn">Record Song</button>
				</div>
				<div id="MySongs-List">
					{this.state.songs.map((s) => (<MySongListItem song={s} />))}
				</div>
			</div>

		);
	}
}

export default MySongWall;