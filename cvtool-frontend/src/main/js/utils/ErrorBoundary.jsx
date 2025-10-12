import PropTypes from "prop-types";
import React from "react";

export class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { theError: undefined };
  }

  static getDerivedStateFromError(error) {
    console.error("getDerivedStateFromError()", error);
    return { theError: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("componentDidCatch()", error, errorInfo.componentStack);
  }
  
  getForegroundColor() {
    const backgroundColor = document.documentElement.style.background;
    const match = /rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/.exec(backgroundColor);
    const avg = (Number.parseInt(match[1]) + Number.parseInt(match[2]) + Number.parseInt(match[3])) / 3;
    return avg < 128
      ? "#ffffff"
      : "#000000";
  }

  render() {
    if (this.state.theError === undefined) {
      return this.props.children;
    } else {
      return (
        <div style={{ color: this.getForegroundColor() }}>
          <h1 style={{ backgroundColor: "#ffaa00" }}>OOPS!</h1>
          <p>Something went terribly wrong: <strong>{this.state.theError.message}</strong></p>
          <p><pre>{this.state.theError.stack.replaceAll("\n", <br />)}</pre></p>
        </div>
      );
    }
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};