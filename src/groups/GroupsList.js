import React, { Component } from "react";
import './Groups.css';
import GroupItem from './GroupItem';

import { Accordion } from 'semantic-ui-react'

class GroupsList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collapseID: "collapse3",
      groupRootPanels: [],
    }

    this.removeGroup = this.removeGroup.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  componentDidMount(){

    var panels = [];

    // For every group generate root panel
    this.props.groups.map((group, index) => {

      const groupInnerDropDownPanels = [
        { key: 'panel-1a', title: 'Members', content: 'Members Here' },
        { key: 'panel-ba', title: 'Files', content: 'Files Here' },
      ]

      const groupInnerDropDown = (
        <div>
          <Accordion panels={groupInnerDropDownPanels} fluid styled />
        </div>
      );

      panels.push(
        { key: `group-${index}`, title: `${group.group_name}` , content: { content: groupInnerDropDown } },
      )
    })

    this.setState({groupRootPanels: panels})
  }

  toggleCollapse(collapseID){
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));
  };

  removeGroup(groupId){
    this.props.removeGroup(groupId);
    return;
  }

  render(){

    const { collapseID } = this.state;

    return (
      <div className="accordion">
        <Accordion panels={this.state.groupRootPanels} fluid styled />
      </div>
    );
  }

}

export default GroupsList;