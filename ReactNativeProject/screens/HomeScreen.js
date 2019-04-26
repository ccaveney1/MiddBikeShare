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
  TouchableHighlight,
  AsyncStorage,
  Button,
  Alert,
  RefreshControl
} from 'react-native';
import { WebBrowser, MapView, Google, Permissions, Location } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.navigate = this.props.navigation.navigate;
  }

  static navigationOptions = {
    title: 'Welcome to the app!',
    header: null,
  };
  state = {
    location: null,
    name: null,
    modalVisible: false,
    bikeSelected: null,
    bikesAvailable: null,
    errorMessage: null,
    refreshing: false,
  };

  componentDidMount() {
      AsyncStorage.getItem('first_name', (err, first_name) => {
        if(err){console.log(err)}
        else{this.setState({ name: first_name })};
      })
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getBikesAvailable().then(() => {
      this.setState({refreshing: false});
    });
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  onNavigateRide = () => {
    this.setModalVisible(!this.state.modalVisible);
    this.navigate('Ride', {location: this.state.location, bikeId: this.state.bikeSelected});
  };

  beginRide = () => {

  };
  reportMissing = () => {

  };
  
  reportDamaged = () => {
    fetch('http://127.0.0.1:3000/rentals/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: '5c87f94fc20223c1282fd8e1',
        bike: '5ca274f279fcd42b80b375da',
        startLocation: 'One Fine Place to find a bike',
        reportDamaged: true,
        reportMissing: false
      }),
    });
  };

  getBikesAvailable = () => {
    return fetch('http://127.0.0.1:3000/bikes/')
      .then((response) => response.json())
      .then((responseJson) => {
        let bikes = responseJson.bikes;
        let availableBikes = [];
        for (var i = 0; i < bikes.length; i++) {
          if(bikes[i].status === 'Available'){
            availableBikes.push(bikes[i]);
          }
        }
        console.log(availableBikes);
        return availableBikes;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    console.log(JSON.stringify(this.state.location));
  };


  render() {
    return (
      <View style={styles.container}>
      <Text>Welcome {this.state.name}</Text>
      {/* <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }> */}
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 44.009690,
            longitude: -73.177175,
            latitudeDelta: 0.0052,
            longitudeDelta: 0.011,
          }}
        />
        {/* </ScrollView> */}
        <View style={{marginTop: 22}}>
        
          <Modal
            onNavigateRide={this.onNavigateRide}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{marginTop: 22}}>
                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={() => {this.onNavigateRide()}}>
                              <Text style={styles.saveButtonText}>Begin Rental</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={()=>Alert.alert(
                          'Bike Number ' + this.state.bikeSelected,
                          'Are you sure you would like to report this bike as Missing?',
                          [
                              {text: 'Yes', onPress: () => this.setModalVisible(!this.state.modalVisible)},
                              {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                              }
                          ],
                          {cancelable: false},
                )}>
                              <Text style={styles.saveButtonText}>Report Missing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={()=>Alert.alert(
                          'Bike Number ' + this.state.bikeSelected,
                          'Are you sure you would like to report this bike as Damaged?',
                          [
                              {text: 'Yes', onPress: () => {
                                this.setModalVisible(!this.state.modalVisible),
                                this.reportDamaged()
                              }},
                              {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                              }
                          ],
                          {cancelable: false},
                )}>
                              <Text style={styles.saveButtonText}>Report Damaged</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
          </Modal>

          <TouchableOpacity style={styles.saveButton} onPress={this._signOutAsync}>
                <Text style={styles.saveButtonText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={() => {
              this.setModalVisible(true);
              this._getLocationAsync();
              this.setState({bikeSelected: 123});
            }}>
                <Text style={styles.saveButtonText}>Bike</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={this.getBikesAvailable}>
                <Text style={styles.saveButtonText}>GetBikes</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }



  _signOutAsync = async () => {
    const clientId = '108117962987-96atlk0mjo5re9nasjarq2a7m7gnfbub.apps.googleusercontent.com';
    try {
        const token = await AsyncStorage.getItem('userToken');
        this.navigate('Auth');
        await Google.logOutAsync({ clientId, token });
        await AsyncStorage.clear();
  }catch(err) {
    return {error: true};
  }
}




  startRide = () => {
    this.navigate('Ride');
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
