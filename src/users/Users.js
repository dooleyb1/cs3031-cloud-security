import React, { Component } from "react";
import "./Users.css";

import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Users extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  // Fetch users here
  componentDidMount(){

    const db = firebase.firestore();

    // Create a reference to the users collection
    var usersRef = db.collection("users");
    var users = [];

    // Create a query against the collection.
    var query = usersRef.get()
    .then((snapShot) => {
      snapShot.docs.map(user => {

        // Extract data for given user
        var userData = user.data();

        // Create user object from response
        var user = {
          "name": userData.name,
          "uid": userData.uid
        }

        users.push(user);
      })

      console.log(users);

      this.setState({
        users: users,
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
                {this.state.users.map((user, i) => (<li key={`user_{i}`}>{user.name} ({user.uid})</li>))}
              </ul>
          }
        </div>
      </div>
    );
  }
}

export default Users;
