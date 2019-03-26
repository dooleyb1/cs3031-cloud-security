import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './Form.js';

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import FileUploader from "react-firebase-file-uploader";
import 'firebase/storage';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

class App extends Component {

  state = {
    username: "",
    isUploading: false,
    progress: 0,
    avatarURL: "",
    showCreateGroup: false,
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
    .storage()
    .ref("images")
    .child(filename)
    .getDownloadURL()
    .then(url => this.setState({ avatarURL: url }));
  };

  createGroup = () => {
    this.setState({ showCreateGroup: true })
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {

    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {
            user
            ? <p>Hello, {user.displayName}</p>
            : <p>Please sign in.</p>
        }
        {
          user
          ? <div>
              {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
              {this.state.showCreateGroup && <Form onChangeValue={this.handleChange} onSubmit={this.handleSubmit}/>}
              <FileUploader
                accept="image/*"
                name="avatar"
                randomizeFilename
                storageRef={firebase.storage().ref("images")}
                onUploadStart={this.handleUploadStart}
                onUploadError={this.handleUploadError}
                onUploadSuccess={this.handleUploadSuccess}
                onProgress={this.handleProgress}
              />
              <br/>
              <button onClick={this.createGroup}>Create Group</button>
              <br/>
              <button onClick={signOut}>Sign out</button>
            </div>
          : <button onClick={signInWithGoogle}>Sign in with Google</button>
      }
    </header>
  </div>
);
}
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
