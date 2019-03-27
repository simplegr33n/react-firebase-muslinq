import React, { Component } from 'react';
import './styles/App.css';
import Firebase from './config/firebaseConfig.js'

// Assets
import cornerLogo from './assets/corner-logo.png'

// Auth
import SignIn from './components/auth/SignIn.js'
import SignUp from './components/auth/SignUp.js'

// Main Content
import PostSong from './components/main-content/PostSong.js'
import SongWall from './components/main-content/SongWall.js'
import MySongWall from './components/main-content/MySongWall.js'
import EditProfile from './components/main-content/EditProfile.js'


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, postsong, songwall, mysongs, editprofile, record, etc.
			UID: null,
			username: ''
		};

		this.firebase = new Firebase()
		this.firebase.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(`UID: ${user.uid}`);
				this.setState({ UID: user.uid });
				this.getUsername();
			}
		});

	}

	getUsername = () => {
		// Users location in tree
		var ref = this.firebase.db.ref().child('users').child(this.state.UID)

		ref.on("value", (snapshot) => {
			this.setState({ username: snapshot.val().username });
		  }, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		  });

	}

	handleSignOut = () => {
		this.setState({ UID: null });
		this.firebase.auth.signOut().then(function () {
			// Sign-out successful.
			console.log(`signed out`)
		}).catch(function (error) {
			// An error happened.
			console.log(`Error signing out: ${error}`)
		});
	}

	handleSignIn = () => {
		// set UID, page to SongWall
		this.setState({
			mainContent: 'songwall'
		});
	}

	setMainContent = (setValue) => {
		this.setState({ mainContent: setValue });
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

	openMySongs = () => {
		if (this.state.mainContent !== 'mysongs') {
			this.setState({ mainContent: 'mysongs' });
		}
	}

	openEditProfile = () => {
		if (this.state.mainContent !== 'editprofile') {
			this.setState({ mainContent: 'editprofile' });
		}
	}


	render() {
		return (
			<div className="App">
				<header className="App-body">
					<div id="App-Inner-Body">
						<div id="App-Header">
							{(() => {
								if (this.state.UID) {
									return (
										<div id="Header-Btns">
											<button id="Profile-Btn" onClick={this.openEditProfile}>Profile</button>
											<button id="Logout-Btn" onClick={this.handleSignOut}>Logout</button>
										</div>
									);
								}
							})()}
						</div>
						<div id="App-Body-Content">
							<div id="Main-Left">
								<div id="Home-Div">
									<img src={cornerLogo} className="Muslinq-logo" alt="muslinq-logo" />
								</div>
								{(() => {
									if (this.state.UID) {
										return (
											<div id="Main-Left-Menu">
												<button className="Left-Menu-Btn" onClick={this.openSongWall}>Song Wall</button>
												<button className="Left-Menu-Btn" onClick={this.openMySongs}>My Songs</button>
												<button className="Left-Menu-Btn" onClick={this.openPostSong}>Upload Song</button>
											</div>
										);
									}
								})()}
							</div>
							<div id="Main-Content">
								{(() => {
									if (this.state.UID) {
										switch (this.state.mainContent) {
											case 'songwall':
												return <SongWall />;
											case 'mysongs':
												return <MySongWall />;
											case 'postsong':
												return <PostSong UID={this.state.UID} username={this.state.username} />;
											case 'editprofile':
												return <EditProfile UID={this.state.UID} username={this.state.username} />;
											default:
												return <SongWall />;
										}
									} else {
										switch (this.state.mainContent) {
											case 'signin':
												return <SignIn gotoSignUp={this.setMainContent} signIn={this.handleSignIn} />;
											case 'signup':
												return <SignUp gotoSignIn={this.setMainContent} />;
											default:
												return <SignIn gotoSignUp={this.setMainContent} signIn={this.handleSignIn} />;
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
