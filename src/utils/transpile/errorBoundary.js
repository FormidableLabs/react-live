import React, { Component } from "react";

const errorBoundary = (Element, errorCallback) => {
  return class ErrorBoundary extends Component {
    componentDidCatch(error) {
      errorCallback(error);
    }

    render() {
      return typeof Element === "function" ? (
        <Element />
      ) : React.isValidElement(Element) ? (
        Element
      ) : null;
    }
  };
};

export default errorBoundary;
