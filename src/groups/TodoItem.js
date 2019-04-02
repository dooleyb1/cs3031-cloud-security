import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './Groups.css';

class TodoItem extends Component {

  constructor(props) {
    super(props);

    this.removeNode = this.removeNode.bind(this);
  }

	removeNode(e){
		e.preventDefault();
    console.log("nodeId=" + this.props.nodeId);
		this.props.removeNode(this.props.nodeId);
		return;
	}

	render(){
		var classes = 'list-group-item clearfix bla';

    const style = {
      minWidth: 5,
      float: "right",
    }

		return (
			<li className={classes}>
        <div className="list-item-container">
          {this.props.task}
          <button type="button" style={style} onClick={this.removeNode}>&#xff38;</button>
        </div>
			</li>
		);
	}
}

export default TodoItem;
