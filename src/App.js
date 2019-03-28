import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";
import Upload from "./upload/Upload";

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

class App extends Component {

  render() {

    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    return (

      <div className="App">
        {
          user
          ? <div className="Container">
              <img alt="upload" className="Cloud-Icon" src="cloud.png"/>
              <hr className="LineBreak"/>
              <div className="d-flex">
                <ButtonGroup size="lg" className="ButtonTabs">
                  <Button>Users</Button>
                  <Button>Groups</Button>
                  <Button>Files</Button>
                  <Button>Upload</Button>
                </ButtonGroup>
              </div>
              <div className="Card">
                  <Upload />
              </div>
              <button className="SignOutButton" onClick={signOut}>Sign Out</button>
            </div>
          : <div className="SignIn">
              <p>Please sign in.</p>
                <button onClick={signInWithGoogle}>Sign In with Google</button>
            </div>
        }
      </div>
    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
