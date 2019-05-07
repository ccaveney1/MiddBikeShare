import React from "react";

import { View, Text, Image } from "react-native";

import Error from "./bikecrash.png";

export default class ErrorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: ""
    };
  }
  componentDidCatch(err, errInfo) {
    console.log(err);
    console.log(errInfo);
    this.setState({
      error: true,
      message: errInfo.componentStack.toString()
    });
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <Image
            source={Error}
            style={{ resizeMode: "contain", height: 150, width: 200 }}
          />
          <Text style={{ textAlign: "center", fontSize: 16, padding: 10 }}>
            Something Went Wrong. Try Again Later
          </Text>
          {__DEV__ ? (
            <Text style={{ textAlign: "center", fontSize: 8, padding: 10 }}>
              {this.state.message}
            </Text>
          ) : null}
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = {
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
};