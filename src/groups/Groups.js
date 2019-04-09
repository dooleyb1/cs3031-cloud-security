import React, { Component } from "react";
import "./Groups.css";

import GroupsList from './GroupsList';
import CreateGroupForm from './CreateGroupForm';
import GroupCreateModal from './GroupCreateModal';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

var CryptoJS = require("crypto-js");
var fileDownload = require('js-file-download');

class Groups extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      createUserModalShow: false,
      addUserModalShow: false,
    };

    this.handleGroupCreate = this.handleGroupCreate.bind(this);
    this.handleGroupRemoval = this.handleGroupRemoval.bind(this);
    this.addUsersToGroup = this.addUsersToGroup.bind(this);
    this.deleteMemberFromGroup = this.deleteMemberFromGroup.bind(this);
    this.deleteFileFromGroup = this.deleteFileFromGroup.bind(this);
    this.fetchGroups = this.fetchGroups.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.addUserModalToggle = this.addUserModalToggle.bind(this);
    this.decryptFile = this.decryptFile.bind(this);
  }

  async componentDidMount(){

    this.fetchUsers();

    this.fetchGroups()
    .then((groups) => {
      this.fetchFiles(groups);
    });
  }

  async fetchUsers(){

    // Set state to loading
    this.setState({
      loading: true
    })

    const db = firebase.firestore();

    // Create a reference to the users collection
    var usersRef = db.collection("users");
    var users = [];

    // Create a query against the collection.
    usersRef.get()
    .then((snapShot) => {
      snapShot.docs.forEach((user) => {

        // Extract data for given user
        users.push(user.data());
        return;
      })

      this.setState({
        users: users
      })

    }).catch((error) => console.error(error.message));
  }

  async fetchFiles(){
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      var files = {};

      this.state.groups.forEach((group) => {
        // Extract files array
        var filesRefs = group.files;
        var fileData, fileRef;
        var groupsFiles = [];

        // For each reference, extract actual data
        filesRefs.forEach((docRef) => {
          var fileRef = db.collection("files").doc(docRef.id);

          fileRef.get()
          .then((doc) => {

            // Extract each file within group and push to array
            var fileData = doc.data();
            groupsFiles.push(fileData);
          })
        })

        // Once we have every file, push to global variable to be set to state
        files[group.id] = groupsFiles;
        console.log(files);
      })

      this.setState({
        loading: false,
        files: files
      })
    })
  }

  async fetchGroups(){

    return new Promise((resolve, reject) => {
      // Set state to loading
      this.setState({
        loading: true
      })

      const db = firebase.firestore();

      // Create a reference to the groups collection
      var groupsRef = db.collection("groups");
      var myGroups = [];

      // Create a query against the collection.
      groupsRef.get()
      .then((snapShot) => {
        snapShot.docs.forEach((group) => {

          // Extract data for given group
          var groupData = group.data();
          myGroups.push(groupData)
        })

        this.setState({
          groups: myGroups,
        })

        resolve(myGroups);

      }).catch((error) => console.log(error.message));
    });
  }

  deleteGroup(groupId){

    // Set state to loading
    this.setState({
      loading: true
    })

    const db = firebase.firestore();

    var groupRef = db.collection("groups").doc(groupId);

    // Delete given group
    groupRef.delete()
    .catch((error) => {
      console.error("Error removing document: ", error);
    })

    this.fetchGroups();
  }

	handleGroupRemoval(groupId){
		this.state.groups.filter(function (el) {
			return el.id !== groupId;
		});

		this.deleteGroup(groupId);
		return;
	}

	handleGroupCreate(group_name){

    const db = firebase.firestore();
    var groupsRef = db.collection("groups");

    var newGroup = {
      "group_name": group_name,
      "members": [],
      "files": [],
    }

    // Push new group to firestore
    groupsRef.add(newGroup)
    .then(function(docRef) {
      // Add ID to group
      docRef.set({
        id: docRef.id
      }, { merge: true })

    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    this.fetchGroups();

    this.setState({
      newGroupName: 'Enter name of new group',
      modalShow: true
    });

    return;
	}

  addUsersToGroup(users, group){

    const db = firebase.firestore();
    var groupRef = db.collection("groups").doc(group);

    // Add each user to group
    users.forEach((user) => {
      groupRef.update({
        members: firebase.firestore.FieldValue.arrayUnion(user)
      });
    })

    // Close modal and fetch updated grouo
    this.setState({ addUserModalShow: false });
    this.fetchGroups()
    .then(() => {
      this.setState({loading: false})
    })
  }

  deleteMemberFromGroup(memberToDelete, group){

    const db = firebase.firestore();
    var groupRef = db.collection("groups").doc(group);

    groupRef.update({
      members: firebase.firestore.FieldValue.arrayRemove(memberToDelete)
    })
    .then((snapshot) => {
      this.fetchGroups()
      .then(() => {
        this.setState({loading: false});
      })
    })
    .catch((error) => {
      console.error('Error removing user,', memberToDelete, 'from group', group);
    })
  }

  async decryptFile(file){

    // Create FileReader and XMLHttpRequest objects
    var xhr = new XMLHttpRequest();
    var reader = new FileReader();

    // Download encrypted file
    xhr.responseType = 'blob';
    xhr.open('GET', file.downloadURL);
    xhr.send();

    // XHR Callback
    xhr.onload = function(event) {
      reader.readAsText(xhr.response);
    };

    // Reader callback
    reader.onload = function (e) {

      // Decrypt file using key
      var decrypted = CryptoJS.AES.decrypt(e.target.result, file.key).toString(CryptoJS.enc.Latin1);

      // Ensure file is not corrupt
      if(!/^data:/.test(decrypted)){
        alert("Invalid pass phrase or file! Please try again.");
        return false;
      } else {
        console.log("Successful decryption", decrypted);
      }

      // Handle decrypted file download here
      fileDownload(decrypted, file.name.replace('.encrypted',''));
    }
  }

  deleteFileFromGroup(file, group){
    console.log('Deleting file', file, 'from group', group);
  }

  addUserModalToggle(){
    this.setState((prevState) => ({
      addUserModalShow: !prevState.addUserModalShow
    }));
  }

  render() {

    let createGroupModalClose = () => this.setState({ createGroupModalClose: false });

    console.log('stateFiles', this.state.files);

    return (
      <div className="GroupsContainer">
        <div className="CenterColumn">
          <CreateGroupForm handleGroupCreate={this.handleGroupCreate} />
          <GroupCreateModal
            show={this.state.createUserModalShow}
            onHide={createGroupModalClose}
            />
          {
            this.state.loading
            ? <p>Loading...</p>
            : <div>
                <GroupsList
                  groups={this.state.groups}
                  users={this.state.users}
                  files={this.state.files}
                  decryptFile={this.decryptFile}
                  deleteMemberFromGroup={this.deleteMemberFromGroup}
                  deleteFileFromGroup={this.deleteFileFromGroup}
                  addUsersToGroup={this.addUsersToGroup}
                  addUserModalToggle={this.addUserModalToggle}
                  addUserModalShow={this.state.addUserModalShow}
                  removeGroup={this.handleGroupRemoval}/>
                <br/>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Groups;
