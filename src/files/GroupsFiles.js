import React, { Component } from "react";
import "./Files.css";

import { List, Icon } from 'semantic-ui-react'

import * as firebase from 'firebase/app';
import 'firebase/firestore';

class GroupsFiles extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.fetchFiles = this.fetchFiles.bind(this);
    this.renderFiles = this.renderFiles.bind(this);
  }

  componentDidMount(){
    this.fetchFiles();
  }

  fetchFiles(){

    // Set state to loading
    this.setState({
      loading: true
    })

    const db = firebase.firestore();

    // Extract files array
    var filesRefs = this.props.group.files;
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

    console.log(files);

    this.setState({
      files: files,
      loading: false
    })
  }

  render() {

    return (<p>Hello</p>);
  }
}

export default GroupsFiles;
