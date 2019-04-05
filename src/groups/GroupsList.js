import React, { Component } from "react";
import './Groups.css';

import { Accordion } from 'semantic-ui-react';

import InnerGroup from './InnerGroup';

class GroupsList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collapseID: "collapse3",
      groupRootPanels: [],
    }

    this.removeGroup = this.removeGroup.bind(this);
    this.deleteMemberFromGroup = this.deleteMemberFromGroup.bind(this);
    this.addUsersToGroup = this.addUsersToGroup.bind(this);
    this.generatePanels = this.generatePanels.bind(this);
  }

  deleteMemberFromGroup(member, group){
    this.props.deleteMemberFromGroup(member, group);
    return;
  }

  addUsersToGroup(users, group){
    this.props.addUsersToGroup(users, group);
    return;
  }

  removeGroup(groupId){
    this.props.removeGroup(groupId);
    return;
  }

  generatePanels(){
      var panels = [];

      // For ever y group generate root panel
      this.props.groups.forEach((group, index) => {

        const groupInnerDropDown = (
          <InnerGroup
            users={this.props.users}
            deleteGroup={this.removeGroup}
            deleteMemberFromGroup={this.deleteMemberFromGroup}
            addUsersToGroup={this.addUsersToGroup}
            members={group.members}
            groupID={group.id}/>
        );

        panels.push(
          { key: `group-${index}`, title: `${group.group_name}` , content: { content: groupInnerDropDown } },
        )
      })

      return panels;
  }

  render(){

    const panels = this.generatePanels();

    return (
      <div className="accordion">
        {
          this.props.users
          ? <Accordion panels={panels} fluid styled />
          : <p>Loading...</p>
        }

      </div>
    );
  }

}

export default GroupsList;
