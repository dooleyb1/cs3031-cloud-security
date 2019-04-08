import React, { Component } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { Checkbox, List, Image } from 'semantic-ui-react'

class UploadGroupSelectModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      groupsSelected: [],
    };

    this.groupSelected = this.groupSelected.bind(this);
  }

  groupSelected(group){

    console.log('Group', group, 'selected');

    // First check if removal or add
    var result = this.state.groupsSelected.filter(filteredGroup => {
      return filteredGroup.id === group.id
    })

    // User not found - add
    if(result.length === 0 && this.state.groupsSelected.length > 0){
      this.setState(prevState => ({
        groupsSelected: [...prevState.groupsSelected, group]
      }));
    }

    // Nothing in state yet, add user
    else if(result.length === 0 && this.state.groupsSelected.length === 0){
      var newState = [];
      newState.push(group);
      this.setState({groupsSelected: newState});
    }

    // User already found - remove
    else {
      var newGroupsToAdd = this.state.groupsSelected.filter(filteredGroup => {
        return filteredGroup.id !== group.id
      })

      this.setState({groupsSelected: newGroupsToAdd});
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
          <Modal.Title>Share File with Groups</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <List divided verticalAlign='middle'>
              {this.props.groups.map((group, i) => {
                return(
                  <List.Item key={`group-${i}`}>
                    <List.Content floated='right'>
                      <Checkbox toggle onChange={() => this.groupSelected(group)}/>
                    </List.Content>
                    <Image floated='left' avatar src={require('../images/avatar/small/mark.png')}/>
                    <List.Content floated='left'>{group.group_name}</List.Content>
                  </List.Item>
                )
              })}
          </List>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.props.onHide}>Close</Button>
          <Button variant="primary" onClick={() => this.props.handleGroupsSelection(this.state.groupsSelected)}>Upload File</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UploadGroupSelectModal;
