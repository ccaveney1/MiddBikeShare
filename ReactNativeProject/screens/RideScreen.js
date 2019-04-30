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
  state = {
    latitude: null,
    longitude: null,
    bike: null,
  };

  endRide = () => {
    this._getLocationAsync().then(() => {
      let url = 'http://127.0.0.1:3000/rentals/'.concat(this.rentalId);
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
  };

  reportDamaged = () => {
    this._getLocationAsync().then(() => {
      let url = 'http://127.0.0.1:3000/rentals/'.concat(this.rentalId);
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


  render() {

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.saveButton} onPress={()=>{
          Alert.alert(
                'Bike Number ' + this.bike.label,
                'Are you sure you would like to end your Ride?',
                [
                    {text: 'Yes', onPress: () => {
                      this.endRide();
                      this.navigate('Home');
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