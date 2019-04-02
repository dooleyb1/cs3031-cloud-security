import React, { Component } from "react";
import TodoItem from './TodoItem';

class TodoList extends Component {

  constructor(props) {
    super(props);

    this.removeNode = this.removeNode.bind(this);
  }

  removeNode(nodeId) {
    this.props.removeNode(nodeId);
    console.log('nodeID= ' + nodeId);
    return;
  }

  render(){

    var listNodes = this.props.groups.map(function (group) {
      return (
        <TodoItem key={group.id} nodeId={group.id} task={group.group_name} removeNode={this.removeNode}/>
      );
    },this);

    return (
      <ul className="list-group">
        {listNodes}
      </ul>
    );
  }

}

export default TodoList;
