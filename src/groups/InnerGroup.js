import React, { Component } from "react";

import { Accordion, Menu, List, Button, Image, Icon, Grid, Popup} from 'semantic-ui-react';
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

    const { activeIndex } = this.state;

    console.log('propfiles', this.props.files);

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
      <Grid columns={2} divided>
        {this.props.files[this.props.groupID].map((file, i) => {
          return(
            <Grid.Row>
              <Grid.Column>
                <a download={`${file.name}`} href={`${file.downloadURL}`} className='file-link'>{file.name}</a>
              </Grid.Column>
              <Grid.Column>
                <Popup trigger={<Button size='sm' icon='unlock' onClick={() => this.props.decryptFile(file)}/>} content='Decrypt File' />
                <Button onClick={() => this.props.deleteFileFromGroup(file, this.props.groupID)} size='tiny' negative>X</Button>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )

    const style = {
      marginTop: 20,
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
        <Button type="button" style={style} onClick={() => this.props.deleteGroup(this.props.groupID)} negative>Delete Group</Button>
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
