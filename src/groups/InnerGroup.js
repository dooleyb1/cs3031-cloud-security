import React, { Component } from "react";

import { Accordion, Menu} from 'semantic-ui-react'

class InnerGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
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
      <ul>
        <li>Member 1</li>
        <li>Member 2</li>
      </ul>
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
        <button type="button" style={style} onClick={() => this.props.removeGroup('he')}>Delete Group</button>
      </div>
    );
  }
}

export default InnerGroup;
