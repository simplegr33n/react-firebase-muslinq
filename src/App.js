import React, { Component } from 'react';
import './styles/App.css';
import Firebase from './config/firebaseConfig.js'

// Assets
import cornerLogo from './assets/corner-logo-blinq.png'


// Auth
import SignIn from './components/auth/SignIn.js'
import SignUp from './components/auth/SignUp.js'
import ChangePassword from './components/auth/ChangePassword.js'

// Main Content
import SongWall from './components/main-content/SongWall.js'
import Studio from './components/main-content/Studio.js'
import RecordSong from './components/main-content/RecordSong.js'
import PostSong from './components/main-content/PostSong.js'
import EditProfile from './components/main-content/EditProfile.js'
import Profile from './components/main-content/Profile.js'
import SongDetails from './components/main-content/SongDetails.js'

// Music Player
import TopBarPlayer from './components/music-player/TopBarPlayer.js'


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, postsong, songwall, songdetails, studio, profile, editprofile, changepw, record, etc.
			username: '',
			user: null,
			currentSong: null, // for playing
			viewSong: null, // to view SongDetails page
			viewProfileId: null // set to ID of profile you want to view
		};

		this.firebase = new Firebase()
		this.firebase.auth.onAuthStateChanged((user) => {
			if (user) {
				//console.log(`UID: ${user.uid}`);
				this.getUserFromDatabase(user.uid);
			}
		});

	}

	getUserFromDatabase = (userId) => {
		// Get user from database
		var ref = this.firebase.db.ref().child('users').child(userId)

		ref.on("value", (snapshot) => {
			this.setState({
				user: snapshot.val(),
			});
		}, function (errorObject) {
			console.log("The user read failed: " + errorObject.code);
		});
	}

	handleSignOut = () => {
		this.setState({ user: null });
		this.firebase.auth.signOut().then(function () {
			// Sign-out successful.
			console.log(`signed out`)
		}).catch(function (error) {
			// An error happened.
			console.log(`Error signing out: ${error}`)
		});
	}

	handleSignIn = () => {
		// page to SongWall
		this.setState({
			mainContent: 'songwall'
		});
	}

	handleSetSong = (setValue) => {
		console.log("App: handleSetSong( " + setValue.songName)
		if (this.state.currentSong !== null && setValue.url !== this.state.currentSong.url) {
			this.setState({
				currentSong: setValue
			});
		} else if (this.state.currentSong == null) {
			this.setState({
				currentSong: setValue
			});
		}
	}

	setMainContent = (setValue) => {
		this.setState({ mainContent: setValue });
	}

	handleSearch = () => {
		alert("App.handleSearch... nothing doing yet")
	}

	openSongWall = () => {
		if (this.state.mainContent !== 'songwall') {
			this.setState({ mainContent: 'songwall' });
		}
	}

	openPostSong = () => {
		if (this.state.mainContent !== 'postsong') {
			this.setState({ mainContent: 'postsong' });
		}
	}

	openStudio = () => {
		if (this.state.mainContent !== 'studio') {
			this.setState({ mainContent: 'studio' });
		}
	}

	openRecord = () => {
		if (this.state.mainContent !== 'record') {
			this.setState({ mainContent: 'record' });
		}
	}

	openEditProfile = () => {
		if (this.state.mainContent !== 'editprofile') {
			this.setState({ mainContent: 'editprofile' });
		}
	}

	gotoProfile = (uid) => {
		console.log("goto profile: " + uid)

		if (this.state.viewProfileId !== uid) {
			this.setState({ viewProfileId: uid });
		}
		if (this.state.mainContent !== 'profile') {
			this.setState({ mainContent: 'profile' });
		}
	}

	gotoSongDetails = (songId) => {
		console.log("App: gotoSongDetails(" + songId)

		if (this.state.viewSong === null || this.state.viewSong.id !== songId) {
			var ref = this.firebase.db.ref().child('songs').child(songId);

			ref.once("value", (snapshot) => {
				this.setState({
					viewSong: snapshot.val()
				});
			}).then(() => {
				if (this.state.mainContent !== 'songdetails') {
					this.setState({ mainContent: 'songdetails' });
				}
			});
		} else {
			if (this.state.mainContent !== 'songdetails') {
				this.setState({ mainContent: 'songdetails' });
			}
		}
	}


	render() {
		return (
			<div className="App">
				<header className="App-body">
					<div id="App-Inner-Body">
						<div id="App-Header">
							<div className="spacer-240w" />
							{(() => {
								if (this.state.user) {
									return (
										<TopBarPlayer song={this.state.currentSong} />
									);
								}
							})()}
						</div>
						<div id="App-Body-Content">
							<div id="Main-Left">
								<button id="Home-Div" onClick={this.openSongWall}>
									<img src={cornerLogo} className="Blinq-logo" alt="Blinq logo" />
								</button>
								{(() => {
									if (this.state.user) {
										return (
											<div id="Main-Left-Menu">
												<div id="Header-Btns">
													<button id="Profile-Btn" onClick={this.openEditProfile}>My Profile</button>
													<button id="Logout-Btn" onClick={this.handleSignOut}>Logout</button>
												</div>
												<div id="Search-Div">
													<input id="Search-Input" />
													<button id="Search-Btn" onClick={this.handleSearch}>
														<div id="mag-glass">
															&#9906;
														</div>
													</button>
												</div>
												<button className="Main-Left-Menu-Btn" onClick={this.openStudio}>STUDIO</button>
												<button className="Main-Left-Menu-Btn" onClick={this.openSongWall}>SONG-WALL</button>
											</div>
										);
									} else {
										return <SignIn signIn={this.handleSignIn} />;
									}
								})()}
							</div>
							<div id="Main-Content">
								{(() => {
									if (this.state.user) {
										switch (this.state.mainContent) {
											// case 'songwall': // Just run songwall as default case
											// 	return <SongWall setSong={this.handleSetSong} gotoProfile={this.gotoProfile} gotoSongDetails={this.gotoSongDetails}/>;
											case 'studio':
												return <Studio user={this.state.user} goto={this.setMainContent} playSong={this.handleSetSong} />;
											case 'postsong':
												return <PostSong user={this.state.user} goto={this.setMainContent} />;
											case 'record':
												return <RecordSong user={this.state.user} goto={this.setMainContent} />;
											case 'editprofile':
												return <EditProfile user={this.state.user} gotoProfile={this.gotoProfile} goto={this.setMainContent} />;
											case 'changepw':
												return <ChangePassword email={this.state.user.email} goto={this.setMainContent} />;
											case 'profile':
												return <Profile profileId={this.state.viewProfileId} setSong={this.handleSetSong} gotoSongDetails={this.gotoSongDetails}/>;
											case 'songdetails':
												return <SongDetails song={this.state.viewSong} setSong={this.handleSetSong} gotoProfile={this.gotoProfile} />;
											default: // 'songwall'
												return <SongWall setSong={this.handleSetSong} gotoProfile={this.gotoProfile} gotoSongDetails={this.gotoSongDetails} />;
										}
									} else {
										switch (this.state.mainContent) {
											case 'signup':
												return <SignUp gotoSignIn={this.setMainContent} />;
											default:
												return <div />;
										}
									}
								})()}
							</div>
						</div>
					</div>
				</header>
			</div>
		);
	}
}

export default App;
