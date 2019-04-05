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
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  componentDidMount(){

    var panels = [];

    // For every group generate root panel
    this.props.groups.forEach((group, index) => {

      const groupInnerDropDown = (
        <InnerGroup />
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

    return (
      <div className="accordion">
        <Accordion panels={this.state.groupRootPanels} fluid styled />
      </div>
    );
  }

}

export default GroupsList;
