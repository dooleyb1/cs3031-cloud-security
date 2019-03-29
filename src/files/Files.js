import React, { Component } from "react";
import "./Files.css";

class Files extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [
      ]
    };
  }

  // Fetch files here
  componentDidMount(){

  }

  render() {

    return (
      <div className="container">
        <div className="center-col">
          <ul>
            {this.state.files.map((file, i) => (<li key={`file_{i}`}>{ file.name }</li>))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Files;
