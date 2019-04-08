import React, { Component } from "react";
import "./Decrypt.css";

import Dropzone from "../dropzone/Dropzone";
import Progress from "../progress/Progress";

import Button from 'react-bootstrap/Button';

var CryptoJS = require("crypto-js");

class Decrypt extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [],
      loading: true,
      decrypting: false,
      decryptProgress: {},
      successfullyDecrypted: false,
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.decrypt = this.decrypt.bind(this);
    this.decryptFiles = this.decryptFiles.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderProgress = this.renderProgress.bind(this);
  }

  componentDidMount(){

    this.setState({loading: false});
  }

  async decrypt(file){
    const reader = new FileReader();

    reader.onload = function (e) {

      var decrypted = CryptoJS.AES.decrypt(e.target.result, 'password').toString(CryptoJS.enc.Latin1);

      if(!/^data:/.test(decrypted)){
          alert("Invalid pass phrase or file! Please try again.");
          return false;
      } else {
        console.log("Successful decryption", decrypted);
      }

      // Handle file download here
      let a = document.createElement('a');
      a.href = decrypted;
      a.setAttribute('download', 'filename.png');
      document.body.appendChild(a);
      a.click();
    }

    reader.readAsText(file);
  }

  async onFilesAdded(files) {

    console.log('Decrypting', files[0]);

    // Decrypt file
    this.decrypt(files[0])
    .then((decryptedFile) => {

      console.log('decryptedFile', decryptedFile);
      // Update state with new encrypted file
      this.setState(prevState => ({
        files: prevState.files.concat(decryptedFile)
      }));
    });
  }

  async decryptFiles() {
    // this.setState({ uploadProgress: {}, uploading: true });
    // const promises = [];
    //
    // this.state.files.forEach(file => {
    //   promises.push(this.sendRequest(file));
    // });
    //
    // try {
    //   await Promise.all(promises);
    //   this.setState({ successfullUploaded: true, uploading: false });
    // } catch (e) {
    //   // Not Production ready! Do some error handling here instead...
    //   this.setState({ successfullUploaded: true, uploading: false });
    // }
  }

  renderProgress(file) {
    const decryptProgress = this.state.decryptProgress[file.name];
    if (this.state.decrypting || this.state.successfullyDecrypted) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={decryptProgress ? decryptProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                decryptProgress && decryptProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullyDecrypted) {
      return (
        <Button
          onClick={() =>
            this.setState({ files: [], successfullyDecrypted: false })
          }
        >
          Clear
        </Button>
      );
    } else {
      return (
        <Button
          disabled={this.state.files.length < 0 || this.state.decrypting}
          onClick={this.decryptFiles}
        >
          Decrypt
        </Button>
      );
    }
  }

  render() {

    return (
      <div className="Decrypt">
        <span className="Title">Decrypt Files</span>
        <div className="Content">
          <div>
            <Dropzone
              message="Decrypt Files"
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.decrypting || this.state.successfullyDecrypted}
            />
          </div>
        </div>
        <div className="Actions">{this.renderActions()}</div>
      </div>
    );
  }
}

export default Decrypt;
