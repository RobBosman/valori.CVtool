import PropTypes from "prop-types";
import React from "react";

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { theError: undefined };
  }

  static getDerivedStateFromError(error) {
    return { theError: error };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.theError !== undefined) {
      return (
        <div>
          <h1 style={{ backgroundColor: "#ffaa00" }}>OOPS</h1>
          <p>Something went terribly wrong: <strong>{this.state.theError.message}</strong></p>
          <p>
            <pre>{this.state.theError.stack.replace("\n", <br />)}</pre>
          </p>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;