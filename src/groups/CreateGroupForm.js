import React, { Component } from "react";

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class CreateGroupForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newGroupName: 'Enter name of new group',
    };

    this.textInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange() {
     const value = this.textInput.current.value
     this.setState({newGroupName: value})
  }

  handleClick() {
    this.props.handleGroupCreate(this.state.newGroupName)
    this.setState({newGroupName: 'Enter name of new group'})
  }

	render(){
		return (
			<div className="commentForm vert-offset-top-2">
          <InputGroup className="mb-3">
            <FormControl
              placeholder={this.state.newGroupName}
              ref={this.textInput}
              id="task"
              type="text"
              onChange={() => this.handleChange()}/>
            <InputGroup.Append>
              <Button variant="primary" onClick={this.handleClick}>Create Group</Button>
            </InputGroup.Append>
          </InputGroup>
			</div>
		);
	}
}

export default CreateGroupForm;
