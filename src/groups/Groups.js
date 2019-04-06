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
      createUserModalShow: false,
      addUserModalShow: false,
    };

    this.handleGroupCreate = this.handleGroupCreate.bind(this);
    this.handleGroupRemoval = this.handleGroupRemoval.bind(this);
    this.addUsersToGroup = this.addUsersToGroup.bind(this);
    this.deleteMemberFromGroup = this.deleteMemberFromGroup.bind(this);
    this.fetchGroups = this.fetchGroups.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.addUserModalToggle = this.addUserModalToggle.bind(this);
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
        users.push(user.data());
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
    this.fetchGroups();
  }

  deleteMemberFromGroup(memberToDelete, group){

    const db = firebase.firestore();
    var groupRef = db.collection("groups").doc(group);

    groupRef.update({
      members: firebase.firestore.FieldValue.arrayRemove(memberToDelete)
    })
    .then((snapshot) => {
      this.fetchGroups();
    })
    .catch((error) => {
      console.error('Error removing user,', memberToDelete, 'from group', group);
    })
  }

  addUserModalToggle(){
    this.setState((prevState) => ({
      addUserModalShow: !prevState.addUserModalShow
    }));
  }

  render() {

    let createGroupModalClose = () => this.setState({ createGroupModalClose: false });

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
                  addUserModalToggle={this.addUserModalToggle}
                  addUserModalShow={this.state.addUserModalShow}
                  removeGroup={this.handleGroupRemoval}/>
                <br/>
                <CreateGroupForm handleGroupCreate={this.handleGroupCreate} />
                <GroupCreateModal
                  show={this.state.createUserModalShow}
                  onHide={createGroupModalClose}
                  />
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Groups;
