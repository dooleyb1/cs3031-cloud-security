import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './Groups.css';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

class GroupItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }

    this.removeGroup = this.removeGroup.bind(this);
  }

	removeGroup(e){
		e.preventDefault();
		this.props.removeGroup(this.props.groupId);
		return;
	}

	render(){
    const { open } = this.state;
		var classes = 'list-group-item clearfix bla';

    const style = {
      minWidth: 5,
      float: "right",
    }

    console.log(this.props.members);

    var members = this.props.members.map(function (member) {
      return (
        <span>{member}</span>
      );
    },this);

		return (
			<li className={classes}>
        <div className="list-item-container">
          <div aria-expanded={open} aria-controls="example-collapse-text" onClick={() => this.setState({ open: !open })}>{this.props.groupName}</div>
          <button type="button" style={style} onClick={this.removeGroup}>&#xff38;</button>
          <button type="button" aria-expanded={open} aria-controls="example-collapse-text" onClick={() => this.setState({ open: !open })}>Click</button>
          <Collapse in={open}>
            {<div id="example-collapse-text">
              {members}
            </div>}
          </Collapse>
        </div>
			</li>
		);
	}
}

export default GroupItem;
