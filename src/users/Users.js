import React, { Component } from "react";
import "./Users.css";

import { Button, Image, List } from 'semantic-ui-react'

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

      console.log(users);

      this.setState({
        users: users,
        loading: false
      })

    }).catch((error) => console.error(error.message));
  }

  render() {

    return (
      <div className="container">
        <div className="center-col">
          {
            this.state.loading
            ? <p>Loading...</p>
            : <List divided verticalAlign='middle'>
                {this.state.users.map((user, i) => {
                  return(
                    <List.Item>
                      <List.Content floated='right'>
                        <Button>Add</Button>
                      </List.Content>
                      <Image floated='left' avatar src={require('../images/avatar/small/mark.png')}/>
                      <List.Content floated='left'>{user.name}</List.Content>
                    </List.Item>
                  )
                })}
            </List>
          }
        </div>
      </div>
    );
  }
}

export default Users;
