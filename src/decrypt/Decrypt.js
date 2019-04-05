import React, { Component } from "react";
import "./Decrypt.css";

import Dropzone from "../dropzone/Dropzone";
import Progress from "../progress/Progress";

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
    return new Promise((resolve, reject) => {
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

        resolve(decrypted);
      }

      reader.readAsText(file);
    });
  }

  async onFilesAdded(files) {

    // Decrypt file
    this.decrypt(files[0])
    .then((decryptedFile) => {

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
        <button
          onClick={() =>
            this.setState({ files: [], successfullyDecrypted: false })
          }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          disabled={this.state.files.length < 0 || this.state.decrypting}
          onClick={this.decryptFiles}
        >
          Decrypt
        </button>
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

export default Decrypt;
