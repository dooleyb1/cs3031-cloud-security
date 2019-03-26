import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './Form.js';
import './Form.css';

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
    justSubmitted: false,
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

    this.setState({justSubmitted:true});

    setTimeout(function(){
      this.setState({justSubmitted:false});
    }.bind(this),5000);  // wait 5 seconds, then reset to false
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
      <div className="app">
        <img src={ require('./images/gh2.png') } className="app-logo" alt="logo" />
        <div className="app-container">
          {
            user
            ? <div>
                <p>Hello, {user.displayName}</p>
                {this.state.justSubmitted && <p>Uploaded Successfully!</p>}
              </div>
            : <p>Please sign in.</p>
          }
          {
            user
            ? <div>
                <label className="btn btn-primary">
                  Upload File to Secure Drive
                  <FileUploader
                    hidden
                    accept="image/*"
                    storageRef={firebase.storage().ref('images')}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
                    />
                </label>
              </div>
            : <div className="button">
                <button onClick={signInWithGoogle} className="btn btn-primary">Sign in With Google</button>
              </div>
          }

        </div>
      </div>
    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
