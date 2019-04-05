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
    this.fetchGroups = this.fetchGroups.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
  }

  componentDidMount(){

    this.fetchGroups()
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
        var groupId = group.id;

        myGroups.push({
          "id": groupId,
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

    // Delete given group
    db.collection("groups").doc(groupId).delete()
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
    groupsRef.add(newGroup);

    this.fetchGroups();

    this.setState({
      newGroupName: 'Enter name of new group',
      modalShow: true
    });

    return;
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
                <GroupsList groups={this.state.groups} removeGroup={this.handleGroupRemoval}/>
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
