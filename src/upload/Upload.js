import React, { Component } from "react";
import "./Upload.css";

import Dropzone from "../dropzone/Dropzone";
import Progress from "../progress/Progress";
import UploadGroupSelectModal from './UploadGroupSelectModal';
import Button from 'react-bootstrap/Button';

import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

var CryptoJS = require("crypto-js");

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      encryptedFiles: [],
      groups: [],
      selectedGroupsForUpload: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false,
      groupSelectModalShow: false,
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.encrypt = this.encrypt.bind(this);
    this.encryptFiles = this.encryptFiles.bind(this);
    this.handleGroupsSelection = this.handleGroupsSelection.bind(this);
    this.toggleGroupSelectModal = this.toggleGroupSelectModal.bind(this);
    this.fetchGroups = this.fetchGroups.bind(this);
  }

  componentDidMount(){
    // Fetch groups
    this.fetchGroups();
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

        myGroups.push({
          "id": groupData.id,
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

  async encrypt(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        var encrypted = CryptoJS.AES.encrypt(e.target.result, 'password');
        resolve('data:application/octet-stream,' + encrypted);
      };

      reader.readAsDataURL(file);
    });
  }

  async encryptFiles(files){

      for(let i=0; i<files.length; i++){

        // Encrypt each file one at a time
        console.log('Encrypting file', files[i]);
        const encryptedFile = await this.encrypt(files[i]);
        console.log('Encrypted file', encryptedFile);

        // Create new object to house file
        var encryptedFileData = {
          name: files[0].name,
          encryptionData: encryptedFile
        };

        // Update state with new encrypted file
        this.setState(prevState => ({
          encryptedFiles: prevState.encryptedFiles.concat(encryptedFileData)
        }));
      }
  }

  async onFilesAdded(files){

    // Add each file to the state
    files.forEach((file) => {
      this.setState(prevState => ({
        files: prevState.files.concat(file)
      }));
    });
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];

    console.log('About to encrypt files', this.state.files);
    // First, encrypt all files
    await this.encryptFiles(this.state.files);

    console.log('Finished encrypting files', this.state.encryptedFiles);

    this.state.encryptedFiles.forEach(file => {
      promises.push(this.sendRequest(file, this.state.selectedGroupsForUpload));
    });

    try {
      await Promise.all(promises);
      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  sendRequest(file, groupsSelected) {
    return new Promise((resolve, reject) => {

      var storageRef = firebase.storage().ref();

      // Upload dataURL of encrypted file
      storageRef.child('files/' + file.name + '.encrypted').putString(file.encryptionData, 'data_url')
      .then((snapshot) => {

        console.log('Successfully uploaded', file.name);

        // Handle successful upload states
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });

        // Extract the downloadURL for the file and store metadata
        snapshot.ref.getDownloadURL().then(function(downloadURL) {

          // Keep a record of file location in database
          const db = firebase.firestore();

          // Create a reference to the file in files and selected groups collection
          var filesRef = db.collection("files");

          // Add metadata for new file
          filesRef.add({
            name: file.name + '.encrypted',
            location: 'files/' + file.name + '.encrypted',
            downloadURL: downloadURL,
            isEncrypted: true,
          })
          .then((fileRef) => {

            var groupsRef = db.collection("groups");

            // For each group selected, insert reference to file
            groupsSelected.forEach((group) => {
              groupsRef.doc(group.id).update({
                files: firebase.firestore.FieldValue.arrayUnion(fileRef)
              })
            });

            resolve(snapshot);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
        });

      })
      .catch((error) => {
        // If there is an error with the upload, reset progress to 0
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(error);
      })
    });
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <Button
          onClick={() =>
            this.setState({
              files: [],
              encryptedFiles: [],
              selectedGroupsForUpload: [],
              successfullUploaded: false
            })
          }
        >
          Clear
        </Button>
      );
    } else {
      return (
        <Button
          disabled={this.state.files.length < 0 || this.state.uploading}
          onClick={this.toggleGroupSelectModal}
        >
          Upload
        </Button>
      );
    }
  }

  toggleGroupSelectModal(){
    this.setState((prevState) => ({
      groupSelectModalShow: !prevState.groupSelectModalShow
    }));
  }

  handleGroupsSelection(selectedGroups){
    this.setState({selectedGroupsForUpload: selectedGroups});
    this.toggleGroupSelectModal();

    // Upload files
    this.uploadFiles();
  }

  render() {
    return (
        <div className="Upload">
          <span className="Title">Upload Files</span>
          <div className="Content">
            <div>
              <Dropzone
                onFilesAdded={this.onFilesAdded}
                message="Upload Files"
                disabled={this.state.uploading || this.state.successfullUploaded}
              />
            </div>
            <div className="Files">
              {this.state.files.map(file => {
                return (
                  <div key={file.name} className="Row">
                    <span className="Filename">{file.name}</span>
                    {this.renderProgress(file)}
                  </div>
                );
              })}
            </div>
            <UploadGroupSelectModal
              show={this.state.groupSelectModalShow}
              onHide={this.toggleGroupSelectModal}
              groups={this.state.groups}
              handleGroupsSelection={this.handleGroupsSelection}
              />
          </div>
          <div className="Actions">{this.renderActions()}</div>
        </div>
    );
  }
}

export default Upload;
