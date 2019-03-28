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

  constructor(props){

    super(props);

    this.handleCreateGroup = this.handleCreateGroup.bind(this);
  }

  state = {
    username: "",
    isUploading: false,
    progress: 0,
    avatarURL: "",
    showCreateGroup: false,
    justSubmitted: false,
    groupName: "",
    showMyGroups: false,
    groups: ["Loading..."],
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

  toggleCreateGroup = () => {
    this.setState({ showCreateGroup: true })
  }

  toggleShowMyGroups = () => {

    const db = firebase.firestore();

    // Create a reference to the groups collection
    var groupsRef = db.collection("groups");
    var myGroups = [];

    // Create a query against the collection.
    var query = groupsRef.where("members", "array-contains", this.props.user.uid).get()
    .then((snapShot) => {
      snapShot.forEach((doc) => {
        myGroups.push(doc.id);
      });

      this.setState({
        groups: myGroups,
        showMyGroups: true
      })

    }).catch((error) => console.log(error.message));
  }

  handleCreateGroup = (groupName) => {
    const db = firebase.firestore();

    var membersArray = [];

    membersArray.push(this.props.user.uid);

    db.settings({
      timestampsInSnapshots: true
    });

    const groupsRef = db.collection('groups').add({
      group_name: groupName,
      members: membersArray
    });

    this.setState({showCreateGroup: false});
  }

  handleGroupNameChange = (event) => {
    this.setState({groupName: event.target.value});
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

    const groups = this.state.groups.map((group) =>
      <li>{group}</li>
    );

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
            ? <div className="app-container">
            {
              this.state.showCreateGroup
                  ? <div className="form">
                      <div className="panel panel-default"></div>
                      <div className={`form-group`}>
                        <input type="text" required className="form-control" name="username"
                          placeholder="Group Name"
                          onChange={this.handleGroupNameChange}/>
                      </div>
                      <button onClick={() => {this.handleCreateGroup(this.state.groupName)}} type="submit" className="btn btn-primary">Create!</button>
                      <div className="panel panel-default"></div>
                    </div>
                  : <div></div>
              }
              {
                this.state.showMyGroups
                    ? <div className="form">
                        <div className="panel panel-default"></div>
                        <div className={`form-group`}>
                          {
                            this.state.groups
                            ? <ul>
                              {groups}
                              </ul>
                            : <p>Loading groups...</p>
                          }
                        </div>
                        <button onClick={() => {this.setState({showMyGroups: false})}} type="submit" className="btn btn-primary">Hide My Groups!</button>
                        <div className="panel panel-default"></div>
                      </div>
                    : <div></div>
                }
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
                <button onClick={this.toggleCreateGroup} className="btn custom-btn btn-primary">Create Group</button>
                <button onClick={this.toggleShowMyGroups} className="btn custom-btn btn-primary">Show My Groups</button>
                <button onClick={signOut} className="btn custom-btn btn-primary">Sign Out</button>
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
