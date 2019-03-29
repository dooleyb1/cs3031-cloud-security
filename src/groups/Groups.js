import React, { Component } from "react";
import "./Groups.css";

import * as firebase from 'firebase/app';
import 'firebase/firestore';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class Groups extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      newGroupName: 'Enter name of new group',
    };

    this.textInput = React.createRef();
    this.handleCreateGroup = this.handleCreateGroup.bind(this);
  }

  // Fetch groups here
  componentDidMount(){

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
        console.log(groupData);

        myGroups.push({
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

  handleChange() {
     const value = this.textInput.current.value
     this.setState({newGroupName: value})
  }

  handleCreateGroup() {

    const db = firebase.firestore();
    var groupsRef = db.collection("groups");

    var newGroup = {
      "group_name": this.state.newGroupName,
      "members": [],
    }

    // Push new group to firestore
    groupsRef.add(newGroup);

    // Update state with new groups
    var groups = this.state.groups;
    groups.push(newGroup);

    this.setState({
      newGroupName: 'Enter name of new group',
      groups: groups,
    })

    return;
  }

  render() {

    return (
      <div className="container">
        <div className="center-col">
          {
            this.state.loading
            ? <p>Loading...</p>
            : <div>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder={this.state.newGroupName}
                    ref={this.textInput}
                    type="text"
                    onChange={() => this.handleChange()}/>
                  <InputGroup.Append>
                    <Button
                      variant="primary"
                      onClick={this.handleCreateGroup}
                    >
                      Create Group
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <ul>
                  {this.state.groups.map((group, i) => (<li key={group.group_name}>{group.group_name}</li>))}
                </ul>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Groups;
