import React, { Component } from "react";
import "./Files.css";

import { List, Icon } from 'semantic-ui-react'

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
            : <List divided verticalAlign='middle'>
              <p>My Group</p>
                {this.state.files.map((file, i) => {
                  return(
                      <List.Item key={`file-${i}`}>
                        <Icon name='lock'/>
                        <List.Content floated='left'>
                          <a download={`${file.name}`} href={`${file.downloadURL}`} className='file-link'>{file.name}</a>
                        </List.Content>
                      </List.Item>
                  )
                })}
                <p>Second Group</p>
                  {this.state.files.map((file, i) => {
                    return(
                        <List.Item key={`file-${i}`}>
                          <Icon name='lock'/>
                          <List.Content floated='left'>
                            <a download={`${file.name}`} href={`${file.downloadURL}`} className='file-link'>{file.name}</a>
                          </List.Content>
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

export default Files;
