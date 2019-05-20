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
  FlatList
} from 'react-native';
import { Location } from 'expo';
import { Permissions } from 'expo';



export default class AdminScreen extends React.Component {
  static navigationOptions = {
    title: 'Admin Page',
    header: null,
  };

  constructor(props) {
    super(props);
    this.navigate = this.props.navigation.navigate;
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
    return location;
  };

  getBikes = (cb) => {
    return fetch('https://midd-bikeshare-backend.herokuapp.com/bikes/')
      .then((response) => response.json())
      .then((responseJson) => {
        let bikes = responseJson.bikes;
        cb(bikes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getUsers = (cb) => {
    return fetch('https://midd-bikeshare-backend.herokuapp.com/users/')
      .then((response) => response.json())
      .then((responseJson) => {
        let bikes = responseJson.users;
        cb(users);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getUserObject = (userId, cb) => {
    let url = 'https://midd-bikeshare-backend.herokuapp.com/users/'.concat(userId);
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        let user = responseJson.user;
        cb(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getRentals = (cb) => {
    return fetch('https://midd-bikeshare-backend.herokuapp.com/rentals/')
      .then((response) => response.json())
      .then((responseJson) => {
        let bikes = responseJson.rentals;
        cb(rentals);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  makeAdmin = (userId) => {
    let url = 'https://midd-bikeshare-backend.herokuapp.com/users/'.concat(userId);
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin: admin,
      })
    });
  };

  addStrike = () => {};


  deleteUser = () => {};


  keyExtractor = (item) => item._id;


  
    render() {
      return (
        <View style={{flex:1, justifyContent:'center', backgroundColor: 'purple'}}>
        <View style={styles.MainContainer}>

          <TouchableOpacity style={styles.saveButton} onPress={()=>{this.navigate('Bikes')}}>
                <Text style={styles.saveButtonText}>Manage Bikes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={()=>{this.navigate('Users')}}>
                <Text style={styles.saveButtonText}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={()=>{this.navigate('Home')}}>
                <Text style={styles.saveButtonText}>Return to Home</Text>
          </TouchableOpacity>
          

        

        </View>
        </View>
      );
    }
  }




const styles = StyleSheet.create({
          MainContainer :{
          justifyContent: 'space-around',
          flex:1,
          margin: 10,
          alignItems: 'center',
          },


          saveButton: {
            borderWidth: 1,
            borderRadius: 30,
            borderColor: 'white',
            backgroundColor: 'white',
            paddingVertical: 15,
            margin: 5,
            width: 250,
          },
          saveButtonText: {
            color: 'purple',
            fontSize: 20,
            textAlign: 'center'
          },
});