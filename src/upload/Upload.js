import React, { Component } from "react";
import Dropzone from "../dropzone/Dropzone";
import "./Upload.css";
import Progress from "../progress/Progress";

import * as firebase from 'firebase/app';
import 'firebase/storage';

var CryptoJS = require("crypto-js");

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);
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

  async decrypt(file){
    const reader = new FileReader();

    reader.onload = function (e) {

      var decrypted = CryptoJS.AES.decrypt(e.target.result, 'password').toString(CryptoJS.enc.Latin1);

      if(!/^data:/.test(decrypted)){
          alert("Invalid pass phrase or file! Please try again.");
          return false;
      }

      // Handle file download here
      let a = document.createElement('a');
      a.href = decrypted;
      a.download = file.name.replace('.encrypted','');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    reader.readAsText(file);
  }

  async onFilesAdded(files) {

    // Encrypt each file //TODO
    this.encrypt(files[0])
    .then((encryptedFile) => {

      // Create new object to house file
      var encryptedFile = {
        name: files[0].name,
        encryptionData: encryptedFile
      };

      console.log(encryptedFile);

      // Update state with new encrypted file
      this.setState(prevState => ({
        files: prevState.files.concat(encryptedFile)
      }));
    })
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];

    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file));
    });

    try {
      await Promise.all(promises);
      console.log('Promises resolved');
      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  sendRequest(file) {
    return new Promise((resolve, reject) => {

      var storageRef = firebase.storage().ref();

      // Upload dataURL of encrypted file
      var uploadTask = storageRef.child('images/' + file.name).putString(file.encryptionData, 'data_url')
      .then((snapshot) => {

        // Handle successful upload states
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(snapshot);
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
        <button
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          disabled={this.state.files.length < 0 || this.state.uploading}
          onClick={this.uploadFiles}
        >
          Upload
        </button>
      );
    }
  }

  render() {
    return (
        <div className="Upload">
          <span className="Title">Encrypt Files</span>
          <div className="Content">
            <div>
              <Dropzone
                onFilesAdded={this.onFilesAdded}
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
          </div>
          <div className="Actions">{this.renderActions()}</div>
        </div>
    );
  }
}

export default Upload;
