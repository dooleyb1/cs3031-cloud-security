import React, { Component } from "react";
import "./ButtonBar.css";

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

class ButtonBar extends Component {

  render() {
    return (
      <div className="d-flex">
        <ButtonGroup size="lg" className="ButtonTabs">
          <Button active={this.props.showUpload} onClick={() => this.props.toggleButtonState("upload")}>Upload</Button>
          <Button active={this.props.showUsers} onClick={() => this.props.toggleButtonState("users")}>Users</Button>
          <Button active={this.props.showGroups} onClick={() => this.props.toggleButtonState("groups")}>Groups</Button>
          <Button active={this.props.showFiles} onClick={() => this.props.toggleButtonState("files")}>Files</Button>
        </ButtonGroup>
    </div>
    );
  }
}

export default ButtonBar;
