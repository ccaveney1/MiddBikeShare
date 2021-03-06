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
  Alert
} from 'react-native';
import { Location } from 'expo';
import { Permissions } from 'expo';


export default class RideScreen extends React.Component {
  static navigationOptions = {
    title: 'You\'re Riding!',
    header: null,
  };

  constructor(props) {
    super(props);
    this.navigate = this.props.navigation.navigate;
    this.bike = this.props.navigation.getParam('bike');
    this.rentalId = this.props.navigation.getParam('rentalId');
  }

  //latitude and longitude of the user, the bike ID, and bikes and markers
  //from database
  state = {
    latitude: null,
    longitude: null,
    bike: null,
    markers: [],
    bikesAvailable: null
  };

//when the ride ends update the location to the database
  endRide = () => {
    this._getLocationAsync().then(() => {
      let url = 'https://midd-bikeshare-backend.herokuapp.com/rentals/'.concat(this.rentalId);
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endLongitude: this.state.longitude,
          endLatitude: this.state.latitude,
          reportDamaged: false,
          bike: this.bike._id
        })
      });
    });
    this.getBikesAvailable(bikes => {
      this.setBikeLocations(bikes, bikeLocations => {
        this.setState({markers: bikeLocations});
        console.log(this.state.markers);
      });
      this.setState({bikesAvailable: bikes})});
  };

//If the user reports the bike as damaged after the ride, then update the database
  reportDamaged = () => {
    this._getLocationAsync().then(() => {
      let url = 'https://midd-bikeshare-backend.herokuapp.com/rentals/'.concat(this.rentalId);
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endLongitude: this.state.longitude,
          endLatitude: this.state.latitude,
          reportDamaged: true,
          bike: this.bike._id
        })
      });
    });
  };

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
    return location;
  };

  //Sets up list of bike markers to be placed on the map
    setBikeLocations = (availableBikes, cb) => {
      bikeMarkers = []
      for (var i = 0; i < availableBikes.length; i++){
        bikeMarkers[i] = {
          title : 'Bike' + toString(i),
          coordinates: {
            latitude: availableBikes[i].currentLatitude,
            longitude: availableBikes[i].currentLongitude,
          },
          id : availableBikes[i]._id
          }
        }
        cb(bikeMarkers);
      }

  // get array of available bike objects from database
  getBikesAvailable = (cb) => {
    return fetch('https://midd-bikeshare-backend.herokuapp.com/bikes/')
      .then((response) => response.json())
      .then((responseJson) => {
        let bikes = responseJson.bikes;
        let availableBikes = [];
        for (var i = 0; i < bikes.length; i++) {
          if(bikes[i].status === 'Available'){
            availableBikes.push(bikes[i]);
          }
        }
        //console.log(availableBikes)
        cb(availableBikes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

//Render the Ride Screen 
  render() {

    return (
      <View style={styles.modal}>
        <Text style={{fontSize: 30, color:'purple', textAlign: 'center', paddingTop: 50, paddingBottom:20}}>You're Riding!</Text>
        <Text style={{fontSize: 20, color:'purple', textAlign: 'center', paddingBottom:20}}>Bike Number {this.bike.label}</Text>
        <TouchableOpacity style={styles.saveButton} onPress={()=>{
          Alert.alert(
                'Bike Number ' + this.bike.label,
                'Are you sure you would like to end your Ride?',
                [
                    {text: 'Yes', onPress: () => {
                      this.endRide();
                      this.navigate('Home', {markers: this.state.markers});
                    }},
                    {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                    }
                ],
                {cancelable: false},
        )}}>
                    <Text style={styles.saveButtonText}>Park your bike!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={()=>Alert.alert(
                'Bike Number ' + this.bike.label,
                'Are you sure you would like to report this bike as Damaged?',
                [
                  {text: 'Yes', onPress: () => {
                    this.reportDamaged();
                    this.navigate('Home');
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
      </View>
    );
  }

}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
    },
    modal: {
      flex:1,
      color: 'white',
      paddingVertical: 200,
      paddingHorizontal: 30,
    }
});
