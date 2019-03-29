import React, { Component } from "react";
import "./Groups.css";

import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Groups extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  // Fetch groups here
  componentDidMount(){

    const db = firebase.firestore();

    // Create a reference to the groups collection
    var groupsRef = db.collection("groups");
    var myGroups = [];

    // Create a query against the collection.
    var query = groupsRef.get()
    .then((snapShot) => {
      snapShot.forEach((doc) => {
        myGroups.push(doc.id);
      });

      this.setState({
        groups: myGroups,
        loading: false
      })

    }).catch((error) => console.log(error.message));
  }

  render() {

    return (
      <div className="container">
        <div className="center-col">
          {
            this.state.loading
            ? <p>Loading...</p>
            : <ul>
                {this.state.groups.map((group, i) => (<li key={`{group}`}>{group}</li>))}
              </ul>
          }
        </div>
      </div>
    );
  }
}

export default Groups;
