import React, { Component } from "react";
import "./Files.css";

import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Files extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [],
      loading: true
    };
  }

  // Fetch files here
  componentDidMount(){

    const db = firebase.firestore();

    // Create a reference to the files collection
    var filesRef = db.collection("files");
    var files = [];

    // Create a query against the collection.
    filesRef.get()
    .then((snapShot) => {
      snapShot.docs.forEach((file) => {

        // Extract data for given file
        var fileData = file.data();
        files.push(fileData);
      })

      this.setState({
        files: files,
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
            : <ul>
                {this.state.files.map((file, i) => (<li key={`file_{i}`}><a download={`${file.name}`} href={`${file.downloadURL}`}>{file.name}</a></li>))}
              </ul>
          }
        </div>
      </div>
    );
  }
}

export default Files;
