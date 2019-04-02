import React, { Component } from "react";
import "./Groups.css";

import TodoList from './TodoList';
import CreateGroupForm from './CreateGroupForm';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

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

    this.generateId = this.generateId.bind(this);
    this.handleNodeRemoval = this.handleNodeRemoval.bind(this);
    this.handleGroupCreate = this.handleGroupCreate.bind(this);
    this.fetchGroups = this.fetchGroups.bind(this);
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
      snapShot.docs.map((group) => {

        // Extract data for given group
        var groupData = group.data();
        var groupId = group.id;

        myGroups.push({
          "id": groupId,
          "group_name": groupData.group_name,
          "members": groupData.members
        });

        return;
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

    // Delete given document
    db.collection("groups").doc(groupId).delete()
    .then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    })

    this.fetchGroups();
  }

	generateId(){
		return Math.floor(Math.random()*90000) + 10000;
	}

	handleNodeRemoval(groupId){
		var groups = this.state.groups;

		groups = groups.filter(function (el) {
			return el.id !== groupId;
		});


		this.deleteGroup(groupId);
		return;
	}

	handleGroupCreate(task){
		var data = this.state.data;
		var id = this.generateId().toString();

		data = data.concat([{id, task}]);
		this.setState({data});

    const db = firebase.firestore();
    var groupsRef = db.collection("groups");

    var newGroup = {
      "group_name": task,
      "members": [],
    }

    // Push new group to firestore
    // groupsRef.add(newGroup);
    console.log(newGroup)

    // Update state with new groups
    var groups = this.state.groups;
    groups.push(newGroup);

    this.setState({
      newGroupName: 'Enter name of new group',
      groups: groups,
    })

    // Set modal
    this.setState({ modalShow: true })
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
                <TodoList groups={this.state.groups} removeNode={this.handleNodeRemoval}/>
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
