import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";

import Upload from "./upload/Upload";
import Users from "./users/Users";
import Groups from "./groups/Groups";
import Files from "./files/Files";
import Decrypt from "./decrypt/Decrypt";

import SignIn from "./sign-in/SignIn";
import ButtonBar from "./button-bar/ButtonBar";

import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

import * as crypto from 'crypto';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showUpload: true,
      showUsers: false,
      showGroups: false,
      showFiles: false,
      showDecrypt: false,
    }

    this.toggleButton = this.toggleButton.bind(this);
  }

  componentDidMount(){
    const hash = crypto.createHash("sha256");
    hash.update("mySup3rC00lP4ssWord");

    const KEY = hash.digest();

    console.log(KEY)
  }

  toggleButton(buttonName){
    switch(buttonName){
      case "upload":
        this.setState(prevState => ({
          showUpload: true,
          showUsers: false,
          showGroups: false,
          showFiles: false,
          showDecrypt: false,
        }));
        break;
      case "users":
        this.setState(prevState => ({
          showUpload: false,
          showUsers: true,
          showGroups: false,
          showFiles: false,
          showDecrypt: false,
        }));
        break;
      case "groups":
        this.setState(prevState => ({
          showUpload: false,
          showUsers: false,
          showGroups: true,
          showFiles: false,
          showDecrypt: false,
        }));
        break;
      case "files":
        this.setState(prevState => ({
          showUpload: false,
          showUsers: false,
          showGroups: false,
          showFiles: true,
          showDecrypt: false,
        }));
        break;
      case "decrypt":
        this.setState(prevState => ({
          showUpload: false,
          showUsers: false,
          showGroups: false,
          showFiles: false,
          showDecrypt: true,
        }));
        break;
      default:
        break;
    }
  }

  render() {

    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    const {
      showUpload,
      showUsers,
      showGroups,
      showFiles,
      showDecrypt,
    } = this.state

    return (

      <div className="App">
        {
          user
          ? <div className="Container">
              <img alt="upload" className="Cloud-Icon" src="cloud.png"/>
              <hr className="LineBreak"/>
              <ButtonBar
                showUpload={this.state.showUpload}
                showUsers={this.state.showUsers}
                showGroups={this.state.showGroups}
                showFiles={this.state.showFiles}
                showDecrypt={this.state.showDecrypt}
                toggleButtonState={this.toggleButton}
              />
              <div className="Card">
                  {showUpload && <Upload/>}
                  {showUsers && <Users/>}
                  {showGroups && <Groups user={user}/>}
                  {showFiles && <Files/>}
                  {showDecrypt && <Decrypt/>}
              </div>
              <button className="SignOutButton" onClick={signOut}>Sign Out</button>
            </div>
          : <SignIn signInFunction={signInWithGoogle}/>
        }
      </div>
    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
