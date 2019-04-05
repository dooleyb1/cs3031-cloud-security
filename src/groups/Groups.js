import React, { Component } from "react";
import "./Groups.css";

import GroupsList from './GroupsList';
import CreateGroupForm from './CreateGroupForm';
import GroupCreateModal from './GroupCreateModal';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Groups extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      modalShow: false,
    };

    this.handleGroupCreate = this.handleGroupCreate.bind(this);
    this.handleGroupRemoval = this.handleGroupRemoval.bind(this);
    this.addUsersToGroup = this.addUsersToGroup.bind(this);
    this.deleteMemberFromGroup = this.deleteMemberFromGroup.bind(this);
    this.fetchGroups = this.fetchGroups.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
  }

  componentDidMount(){

    this.fetchGroups()
    this.fetchUsers();
  }

  fetchUsers(){

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
        var userData = user.data();

        users.push({
          "name": userData.name,
          "uid": userData.uid
        });

        return;
      })

      this.setState({
        users: users,
        loading: false
      })

    }).catch((error) => console.error(error.message));
  }

  fetchGroups(){

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

        myGroups.push({
          "id": groupData.id,
          "group_name": groupData.group_name,
          "members": groupData.members
        });
      })

      this.setState({
        groups: myGroups,
        loading: false
      })

    }).catch((error) => console.log(error.message));
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
    .then(() => {
      console.log("Group successfully deleted!");
    }).catch((error) => {
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
    }

    // Push new group to firestore
    groupsRef.add(newGroup)
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);

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
    console.log('Adding ', users, ' to group ', group);
    console.log(group);

    const db = firebase.firestore();
    var groupRef = db.collection("groups").doc(group);

    groupRef.update({
      members: firebase.firestore.FieldValue.arrayUnion(users[0])
    });
  }

  deleteMemberFromGroup(member, group){
    console.log('Deleting ', member, ' from group ', group);
  }

  render() {

    let modalClose = () => this.setState({ modalShow: false });

    return (
      <div className="container">
        <div className="center-col">
          {
            this.state.loading
            ? <p>Loading...</p>
            : <div>
                <GroupsList
                  groups={this.state.groups}
                  users={this.state.users}
                  deleteMemberFromGroup={this.deleteMemberFromGroup}
                  addUsersToGroup={this.addUsersToGroup}
                  removeGroup={this.handleGroupRemoval}/>
                <br/>
                <CreateGroupForm handleGroupCreate={this.handleGroupCreate} />
                <GroupCreateModal
                  show={this.state.modalShow}
                  onHide={modalClose}
                  />
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Groups;
