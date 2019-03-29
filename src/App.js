import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";

import Upload from "./upload/Upload";
import Users from "./users/Users";
import Groups from "./groups/Groups";
import Files from "./files/Files";

import SignIn from "./sign-in/SignIn";
import ButtonBar from "./button-bar/ButtonBar";

import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

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
    }

    this.toggleButton = this.toggleButton.bind(this);
  }

  toggleButton(buttonName){
    switch(buttonName){
      case "upload":
        this.setState(prevState => ({
          showUpload: true,
          showUsers: false,
          showGroups: false,
          showFiles: false,
        }));
        break;
      case "users":
        this.setState(prevState => ({
          showUpload: false,
          showUsers: true,
          showGroups: false,
          showFiles: false,
        }));
        break;
      case "groups":
        this.setState(prevState => ({
          showUpload: false,
          showUsers: false,
          showGroups: true,
          showFiles: false,
        }));
        break;
      case "files":
        this.setState(prevState => ({
          showUpload: false,
          showUsers: false,
          showGroups: false,
          showFiles: true,
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
                toggleButtonState={this.toggleButton}
              />
              <div className="Card">
                  {showUpload && <Upload/>}
                  {showUsers && <Users/>}
                  {showGroups && <Groups user={user}/>}
                  {showFiles && <Files/>}
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
