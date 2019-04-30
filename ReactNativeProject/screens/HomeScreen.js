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
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import { WebBrowser, MapView, Google, Location } from 'expo';
import { Permissions } from 'expo';
import {Marker} from 'react-native-maps'
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
    name: null, //user's first name; retrieved from google sign-in/async storage
    modalVisible: false,
    bikeSelected: null, //bike object
    bikesAvailable: null, //array of bike objects
    errorMessage: null, //error message for location permissions
    refreshing: false,
    userId: null, //unique userId in database
    latitude: null,
    longitude: null,
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

  // set first name, user id, and available bikes in state as soon as component mounts
  componentDidMount() {
      AsyncStorage.getItem('first_name', (err, first_name) => {
        if(err){console.log(err)}
        else{this.setState({ name: first_name })};
      });
      AsyncStorage.getItem('user_id', (err, user_id) => {
        if(err){console.log(err)}
        else{this.setState({ userId: user_id })};
      })
      this.getBikesAvailable(bikes => {
        this.setState({bikesAvailable: bikes})});
  }

  // not implemented yet... goal is to refresh map with available bikes
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getBikesAvailable(bikes => {this.setState({bikesAvailable: bikes})})
      .then(() => {
      this.setState({refreshing: false});
    });
  }

  // modal with options to rent or report bike
  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  // when begin ride button is pressed
  onNavigateRide = () => {
    this.setModalVisible(!this.state.modalVisible);
    this.beginRide(rentalId => {
      this.navigate('Ride', {bike: this.state.bikeSelected, rentalId: rentalId});
    });    
  };


  // send rental instance to database (start ride)
  beginRide = (cb) => {
    fetch('http://127.0.0.1:3000/rentals/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.userId,
        bike: this.state.bikeSelected._id,
        startLatitude: this.state.latitude,
        startLongitude: this.state.longitude,
        reportDamaged: false,
        reportMissing: false
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      cb(responseJson.rental._id);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  // send rental instance to database (missing)
  reportMissing = () => {
    return fetch('http://127.0.0.1:3000/rentals/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.userId,
        bike: this.state.bikeSelected._id,
        startLatitude: this.state.latitude,
        startLongitude: this.state.longitude,
        reportDamaged: false,
        reportMissing: true
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      return responseJson.rental._id;
    })
    .catch((error) => {
      console.error(error);
    });

  };

  // send rental instance to database (damaged)
  reportDamaged = () => {
    return fetch('http://127.0.0.1:3000/rentals/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.userId,
        bike: this.state.bikeSelected._id,
        startLatitude: this.state.latitude,
        startLongitude: this.state.longitude,
        reportDamaged: true,
        reportMissing: false
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });

  };

  // get array of available bike objects from database
  getBikesAvailable = (cb) => {
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
        cb(availableBikes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // set bikeSelected to bike object by bikeId (could change to select by bikeLabel)
  selectBike = async (bikeId) => {
    try{
      let bikeSelected = this.state.bikesAvailable.find(bike => {
      return bike._id === bikeId;
    });
    await this.setState({ bikeSelected });
    }catch(err){
      console.log(err);
    }
  }

  // get current location with permissions
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
  };

  //sign out, clear async storage, set name and userId states to null
  _signOutAsync = async () => {
    const clientId = '108117962987-96atlk0mjo5re9nasjarq2a7m7gnfbub.apps.googleusercontent.com';
    try {
        const token = await AsyncStorage.getItem('userToken');
        this.setState({name: null, userId: null})
        this.navigate('Auth');
        await Google.logOutAsync({ clientId, token });
        await AsyncStorage.clear();
    }catch(err) {
        return {error: true};
    }
``}


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
          }}>{this.state.markers.map((marker, index) => (
            <MapView.Marker
            coordinate={marker.coordinates}
            key={index}
            title={marker.title}
            pinColor = {'purple'}
            identifier = {marker.id}
            onSelect={e => console.log(e.nativeEvent)}
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              }}
            ><Image source={require('./bike.png')} style={{height: 35, width:35, }}/></MapView.Marker>
          ))}</MapView>
        
        
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
                          'Bike Number ' + this.state.bikeSelected.label,
                          'Are you sure you would like to report this bike as Missing?',
                          [
                              {text: 'Yes', onPress: () => {
                                this.setModalVisible(!this.state.modalVisible),
                                this.reportMissing()
                              }},                              {
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
                          'Bike Number ' + this.state.bikeSelected.label,
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
              this.selectBike("5cc76f7f2a9171f49a6212be");
            }}>
                <Text style={styles.saveButtonText}>Bike</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={() => {this.getBikesAvailable(bikes =>{
            console.log(bikes);``
          })}}>
                <Text style={styles.saveButtonText}>GetBikes</Text>
          </TouchableOpacity>
          


      </View>
    );
  }


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
  inputWrapper: {
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  saveButton: {
      borderWidth: 1,
      borderColor: 'purple',
      backgroundColor: 'purple',
      padding: 15,
      margin: 5
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 20,
      textAlign: 'center'
    }
});
