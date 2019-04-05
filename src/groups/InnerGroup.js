import React, { Component } from "react";

import { Accordion, Menu, List, Icon, Button, Image } from 'semantic-ui-react';
import AddUserToGroupModal from './AddUserToGroupModal';

class InnerGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      modalShow: false,
    };

    this.triggerModal = this.triggerModal.bind(this);
  }

  handleClick = (e, titleProps) => {

    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }

  triggerModal = () => {
    console.log('triggering');
    this.setState({modalShow: true})
  }

  render() {

    const { activeIndex } = this.state

    const MembersList = (
      <List divided verticalAlign='top'>
      {this.props.members.map((member, i) => {
        return(
          <List.Item key={`member-${i}`}>
            <List.Content floated='right'>
              <Button onClick={() => this.props.deleteMemberFromGroup(member, this.props.groupID)} size='tiny' negative>X</Button>
            </List.Content>
            <Image floated='left' avatar src={require('../images/avatar/small/mark.png')}/>
            <List.Content floated='left'>{member}</List.Content>
          </List.Item>
        )
      })}
      <Button onClick={() => this.triggerModal()} size='tiny' positive>Add Users</Button>
      </List>
    )

    const FilesList = (
      <ul>
        <li>File 1</li>
        <li>File 2</li>
      </ul>
    )

    const style = {
      marginTop: 15,
      minWidth: 5,
    }

    let modalClose = () => this.setState({ modalShow: false });

    return (
      <div>
        <Accordion as={Menu} vertical>
          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 0}
              content='Members'
              index={0}
              onClick={this.handleClick}
            />
            <Accordion.Content active={activeIndex === 0} content={MembersList} />
          </Menu.Item>

          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 1}
              content='Files'
              index={1}
              onClick={this.handleClick}
            />
          <Accordion.Content active={activeIndex === 1} content={FilesList} />
          </Menu.Item>
        </Accordion>
        <button type="button" style={style} onClick={() => this.props.deleteGroup(this.props.groupID)}>Delete Group</button>
        <AddUserToGroupModal
          addUsersToGroup={this.props.addUsersToGroup}
          group={this.props.groupID}
          users={this.props.users}
          show={this.state.modalShow}
          onHide={modalClose}
          />
      </div>
    );
  }
}

export default InnerGroup;
