import React, { Component } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { Checkbox, List, Image } from 'semantic-ui-react'

class AddUserToGroupModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      usersToAdd: [],
    };

    this.userSelected = this.userSelected.bind(this);
  }

  userSelected(user){

    // First check if removal or add
    var result = this.state.usersToAdd.filter(filteredUser => {
      return filteredUser.uid === user.uid
    })

    // User not found - add
    if(result.length === 0 && this.state.usersToAdd.length > 0){
      this.setState(prevState => ({
        usersToAdd: [...prevState.usersToAdd, user]
      }));
    }

    // Nothing in state yet, add user
    else if(result.length === 0 && this.state.usersToAdd.length === 0){
      var newState = [];
      newState.push(user);
      this.setState({usersToAdd: newState});
    }

    // User already found - remove
    else {
      var newUsersToAdd = this.state.usersToAdd.filter(filteredUser => {
        return filteredUser.uid !== user.uid
      })

      this.setState({usersToAdd: newUsersToAdd});
    }
  }

  render() {

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Users to Add</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <List divided verticalAlign='middle'>
              {this.props.users.map((user, i) => {
                return(
                  <List.Item key={`user-${i}`}>
                    <List.Content floated='right'>
                      <Checkbox toggle onChange={() => this.userSelected(user)}/>
                    </List.Content>
                    <Image floated='left' avatar src={require('../images/avatar/small/mark.png')}/>
                    <List.Content floated='left'>{user.name}</List.Content>
                  </List.Item>
                )
              })}
          </List>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.props.onHide}>Close</Button>
          <Button variant="primary" onClick={() => this.props.addUsersToGroup(this.state.usersToAdd,this.props.group)}>Add Users</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddUserToGroupModal;
