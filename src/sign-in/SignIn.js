import React, { Component } from "react";
import "./SignIn.css";

class SignIn extends Component {

  render() {
    return (
      <div>
        <p>Please sign in.</p>
        <button onClick={this.props.signInFunction}>Sign In with Google</button>
      </div>
    );
  }
}

export default SignIn;
