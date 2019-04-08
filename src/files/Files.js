import React, { Component } from "react";
import "./Files.css";

import { List, Icon } from 'semantic-ui-react'

import GroupsFiles from './GroupsFiles';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Files extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: '',
      groups: [],
      loading: true
    };

    this.fetchGroups = this.fetchGroups.bind(this);
  }

  // Fetch files here
  async componentDidMount(){
    await this.fetchGroups();
  }

  async fetchFilesForGroup(group){

    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      // Extract files array
      var filesRefs = group.files;
      var files = []
      var fileData, fileRef;

      // For each reference, extract actual data
      filesRefs.forEach((docRef) => {
        var fileRef = db.collection("files").doc(docRef.id);

        fileRef.get()
        .then((doc) => {
          var fileData = doc.data();

          files.push(fileData);
        })
      })
      resolve(files)
    })
  }

  async fetchGroups(){

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
        myGroups.push(groupData);

        this.fetchFilesForGroup(groupData)
        .then((files) => {
          this.setState(prevState => ({
              files: {
                  ...prevState.files,
                  [group.id]: files
              }
          }))
        });
      })

      console.log(myGroups);
      this.setState({
        groups: myGroups,
        loading: false
      })

    }).catch((error) => console.log(error.message));
  }

  renderFilesForGroup(group){

    if(this.state.files[group.id]){
      return this.state.files[group.id].map((file) =>
        <li>{file.name}</li>
      )
    } else{
      return (<li>Loading...</li>)
    }
  }

  render() {

    return (
      <p>Hi</p>
    );
  }
}

export default Files;
