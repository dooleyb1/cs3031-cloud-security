import React, { Component } from "react";

import { Accordion, Menu, List, Button, Image } from 'semantic-ui-react';
import AddUserToGroupModal from './AddUserToGroupModal';

class InnerGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      modalShow: false,
    };
  }

  handleClick = (e, titleProps) => {

    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
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
            <List.Content floated='left'>{member.name}</List.Content>
          </List.Item>
        )
      })}
      <Button onClick={() => this.props.addUserModalToggle()} size='tiny' positive>Add Users</Button>
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
          members={this.props.members}
          users={this.props.users}
          addUserModalToggle={this.props.addUserModalToggle}
          show={this.props.addUserModalShow}
          onHide={this.props.addUserModalToggle}
          />
      </div>
    );
  }
}

export default InnerGroup;
