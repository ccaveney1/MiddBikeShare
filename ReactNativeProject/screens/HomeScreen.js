import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableHighlight
} from 'react-native';
import { WebBrowser, MapView } from 'expo';
import {Marker} from 'react-native-maps'

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    modalVisible: false,
    markers: [{
    title: 'Bike 1',
    coordinates: {
      latitude: 44.009690,
      longitude: -73.177175
    },
    id: '1'
  },
  {
    title: 'Bike 2',
    coordinates: {
      latitude: 44.01,
      longitude: -73.178
    },
    id: '2'
  }]
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setBikeLocations(){
    //set the bike pin to the new user location
    //this.setState({location: bikeLoc})
  }
  // getInitialState() {
  //   return {
  //     region: {
  //       latitude: 44.009690,
  //       longitude: -73.177175,
  //       latitudeDelta: 0.0052,
  //       longitudeDelta: 0.011,
  //     },
  //   };
  // }

  // onRegionChange(region) {
  //   this.setState({ region });
  // }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 44.009690,
            longitude: -73.177175,
            latitudeDelta: 0.0052,
            longitudeDelta: 0.011,
          }}
        >
        {this.state.markers.map(marker => (
        <MapView.Marker
        coordinate={marker.coordinates}
        title={marker.title}
        pinColor = {'purple'}
        onSelect={e => console.log(e.nativeEvent)}
        >
        <Image source={require('./bike.png')} style={{height: 35, width:35, }} />
        </MapView.Marker>
        ))}
    </MapView>

      <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <TouchableOpacity style={styles.saveButton} onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={styles.saveButtonText}>Begin Rental</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={styles.saveButtonText}>Report Missing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={styles.saveButtonText}>Report Damaged</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={styles.saveButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.saveButton} onPress={() => {
            this.setModalVisible(true);
          }}>
              <Text style={styles.saveButtonText}>Bike</Text>
          </TouchableOpacity>
      </View>
        {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}></View>
          <Text style={styles.getStartedText}>Welcome to Middlebury Bike Share!</Text>
          <TouchableOpacity style={styles.saveButton} onPress={() => }>
              <Text style={styles.saveButtonText}>Begin Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={() => }>
              <Text style={styles.saveButtonText}>Report Damaged</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={() => }>
              <Text style={styles.saveButtonText}>Report Missing</Text>
          </TouchableOpacity>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>Get started by opening</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload WOOP WOOOP.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View> */}
      </View>
    );
  }


  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  saveButton: {
      borderWidth: 1,
      borderColor: '#007BFF',
      backgroundColor: '#007BFF',
      padding: 15,
      margin: 5
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 20,
      textAlign: 'center'
    }
});
