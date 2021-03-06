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
  FlatList,
  TextInput,
} from 'react-native';
import { Location } from 'expo';
import { Permissions } from 'expo';



export default class BikesComponent extends React.Component {

  constructor(props) {
    super(props);
    this.navigate = this.props.navigation.navigate;
    this.mounted = false;
  }

//state in Admin bikes screen are the bikes in the system, user current latitude and longitude
//and admin user input
  state = {
      bikes: [],
      latitude: null,
      longitude: null,
      labelInputText: '',
  };


//When the page loads, get the bikes from the database and set them in
//the state
  componentDidMount() {
    this.mounted=true;
    this.getBikes(bikes => {
      if(this.mounted){
        this.setState({bikes});
      }
    });
  }


//If the screen updates, get the bikes from the database
  componentDidUpdate() {
    this.getBikes(bikes => {
      if(this.mounted){
        this.setState({bikes});
      }
    });
  }

  componentWillUnmount() {
    this.mounted=false;
  }

  // get current location with permissions, and set state
  _getLocationAsync = async () => {
    if(this.mounted){
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
      }
      let location = await Location.getCurrentPositionAsync({});
      this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
      return location;
  }
  };

//Callback function to make a call to the database and get the all the bikes
//in the database and return them into bikes
  getBikes = (cb) => {
    if(this.mounted){
      return fetch('https://midd-bikeshare-backend.herokuapp.com/bikes/')
      .then((response) => response.json())
      .then((responseJson) => {
        let bikes = responseJson.bikes;
        cb(bikes);
      })
      .catch((error) => {
        console.error(error);
      });
    }

  };

//Callback function to database to get admin user information
  getUserObject = (userId, cb) => {
    if(this.mounted){
      let url = 'https://midd-bikeshare-backend.herokuapp.com/users/'.concat(userId);
      return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          let user = responseJson.user;
          cb(user);
        })
        .catch((error) => {
          console.error(error);
        })
      }
  };

//If the admin would like to change the status of the bike, change to whatever
//is clicked by the admin and update database
  updateBikeStatus = (bikeId, bikeStatus) => {
    let url = 'https://midd-bikeshare-backend.herokuapp.com/bikes/'.concat(bikeId);
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: bikeStatus,
      })
    });
  };

//If admin chooses to update the location of the bike to their location, update
//location of bike in the database
  updateBikeLocation = (bikeId) => {
    this._getLocationAsync().then(() => {
      let url = 'https://midd-bikeshare-backend.herokuapp.com/bikes/'.concat(bikeId);
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLatitude: this.state.latitude,
          currentLongitude: this.state.longitude,
        })
      });
    });
  };

//If admin chooses to update the user of the bike to them, update user ID in
//the database
  updateBikeUser = (bikeId) => {
    AsyncStorage.getItem('user_id').then((user_id) => {
    let url = 'https://midd-bikeshare-backend.herokuapp.com/bikes/'.concat(bikeId);
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentUser: user_id,
      })
    });
    })
  };

//If admin adds a bike to the database, add given label and set the rest of the
//information as if the admin user were renting it
  addBike = (label) => {
    this._getLocationAsync().then(() => {
      AsyncStorage.getItem('user_id').then((user_id) => {
        let url = 'https://midd-bikeshare-backend.herokuapp.com/bikes/';
        return fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Rented',
            currentLatitude: this.state.latitude,
            currentLongitude: this.state.longitude,
            label: label,
            currentUser: user_id,
          })
        });
        })
    })
  };

//Delete bike from database if admin removes bike on the screen
  deleteBike = (bikeId) => {
    let url = 'https://midd-bikeshare-backend.herokuapp.com/bikes/'.concat(bikeId);
    return fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
  };


//This is the card style for each bike in the database
  BikeItem = (item) => {
      return(
        <View style={styles.modalView}>
            <Text style={styles.item}>
                Bike Number {item.label}
            </Text>
            <TouchableHighlight
            style={styles.buttonStyleLocation}
            onPress={()=>{
              this.getUserObject(item.currentUser, (userObject => {
                let title = 'No Current User';
                if(userObject){
                  title = 'User: ' + userObject.email;
                }
                Alert.alert(
                  title,
                  'Would you like to update the bike\'s current user to you?',
                  [
                      {text: 'Yes', onPress: () => {
                        this.updateBikeUser(item._id);
                      }},
                      {
                      text: 'No',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                      }
                  ],
                  {cancelable: false},
              )
              }))
              }}>
              <Text style={styles.buttonText}>View/Update User</Text>
            </TouchableHighlight>
            <Text>Update Status:</Text>
            <View style={styles.statusButtonsView}>
            <TouchableHighlight
            style={[(item.status === 'Available') ? styles.buttonStyleHighlight : styles.buttonStyle]}
            onPress={()=>{
              Alert.alert(
                    'Bike ' + item.label,
                    'Are you sure you would like to update to Available?',
                    [
                        {text: 'Yes', onPress: () => {
                          this.updateBikeStatus(item._id, 'Available');
                        }},
                        {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                        }
                    ],
                    {cancelable: false},
              )}}>
              <Text style={styles.buttonText}>Available</Text>
            </TouchableHighlight>
            <TouchableHighlight
            style={[(item.status === 'Rented') ? styles.buttonStyleHighlight : styles.buttonStyle]}
            onPress={()=>{
              Alert.alert(
                'Bike ' + item.label,
                'Are you sure you would like to update to Rented?',
                    [
                        {text: 'Yes', onPress: () => {
                          this.updateBikeStatus(item._id, 'Rented');
                        }},
                        {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                        }
                    ],
                    {cancelable: false},
              )}}>
              <Text style={styles.buttonText}>Rented</Text>
            </TouchableHighlight>
            <TouchableHighlight
            style={[(item.status === 'Damaged') ? styles.buttonStyleHighlight : styles.buttonStyle]}
            onPress={()=>{
              Alert.alert(
                'Bike ' + item.label,
                'Are you sure you would like to update to Damaged?',
                    [
                        {text: 'Yes', onPress: () => {
                          this.updateBikeStatus(item._id, 'Damaged');
                        }},
                        {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                        }
                    ],
                    {cancelable: false},
              )}}>
              <Text style={styles.buttonText}>Damaged</Text>
            </TouchableHighlight>
            <TouchableHighlight
            style={[(item.status === 'Missing') ? styles.buttonStyleHighlight : styles.buttonStyle]}
            onPress={()=>{
              Alert.alert(
                'Bike ' + item.label,
                'Are you sure you would like to update to Missing?',
                    [
                        {text: 'Yes', onPress: () => {
                          this.updateBikeStatus(item._id, 'Missing');
                        }},
                        {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                        }
                    ],
                    {cancelable: false},
              )}}>
              <Text style={styles.buttonText}>Missing</Text>
            </TouchableHighlight>
            </View>
            <Text>Location: {item.currentLatitude}, {item.currentLongitude}</Text>
            <TouchableHighlight
            style={styles.buttonStyleLocation}
            onPress={()=>{
              Alert.alert(
                    'Bike ' + item.label,
                    'Are you sure you would like to update to your current location?',
                    [
                        {text: 'Yes', onPress: () => {
                          this.updateBikeLocation(item._id);
                        }},
                        {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                        }
                    ],
                    {cancelable: false},
              )}}>
              <Text style={styles.buttonText}>Update to your current location</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.buttonStyleLocation}
            onPress={() => {
              Alert.alert(
                'Remove Bike ' + item.label,
                'Are you sure you would like to delete this bike from the database?',
                [
                    {text: 'Yes', onPress: () => {
                      this.deleteBike(item._id);
                    }},
                    {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                    }
                ],
                {cancelable: false},
          )
            }}
            >
              <Text style={styles.buttonText}>Remove Bike</Text>
            </TouchableHighlight>
        </View>
      );

  }




  keyExtractor = (item) => item._id;


  //main screen style
    render() {
      return (
        <View style={{flex:1, justifyContent:'center', backgroundColor: 'purple'}}>
        <View style={styles.MainContainer}>

      <Text style = {{fontSize:24, color: 'white', padding:10}}>Manage Bikes</Text>

      <View style={{flex:1, flexDirection: 'row', marginBottom: 30, paddingBottom: 30}}>
      <TouchableHighlight style={styles.buttonStyleAdd}
      onPress={()=>{
        if(this.state.labelInputText === ''){
          Alert.alert(
            'No Label Entered',
            'Please enter a unique label for the bike',
            [
                {text: 'Ok', onPress: () => {
                }},
            ],
            {cancelable: false},
      )}
        else{
        Alert.alert(
              'Add Bike',
              'Are you sure you would like to add a bike with label ' + this.state.labelInputText,
              [
                  {text: 'Yes', onPress: () => {
                    this.addBike(this.state.labelInputText);
                  }},
                  {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                  }
              ],
              {cancelable: false},
        )}}
            }
      >
          <Text style={{color: 'purple', marginHorizontal: 10}}>Add a Bike</Text>
      </TouchableHighlight>
      <TextInput
            placeholder='Label'
            style={{height: 30, width: 60, borderColor: 'white', backgroundColor:'white', borderWidth: 2, borderRadius: 5, marginHorizontal: 20}}
            onChangeText={(text) => this.setState({labelInputText: text})}
            value={this.state.labelInputText}
            maxLength = {3}
          />
      </View>


       <FlatList
          data={ this.state.bikes }
          keyExtractor={this.keyExtractor}
          renderItem={({item}) => this.BikeItem(item)}
        />



        </View>
        </View>
      );
    }
  }



//style for all the various buttons
const styles = StyleSheet.create({
    MainContainer :{

        // Setting up View inside content in Vertically center.
        justifyContent: 'center',
        flex:1,
        margin: 10,
        },

        statusButtonsView : {
          justifyContent: 'center',
          flex: 1,
          flexDirection: 'row',
        },

        buttonStyle :{
          height: 30,
          width: 80,
          backgroundColor: 'purple',
          margin:5,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius:5,
        },
        buttonStyleHighlight :{
          height: 30,
          width: 80,
          backgroundColor: 'navy',
          margin:5,
          alignItems: 'center',
          borderRadius:5,
          justifyContent: 'center',
        },

        buttonStyleLocation :{
          height: 30,
          width: 240,
          backgroundColor: 'purple',
          marginBottom:10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius:5,
        },

        buttonStyleAdd :{
          height: 30,
          width: 240,
          backgroundColor: 'white',
          marginBottom:10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius:5,
        },

        buttonText: {
          color: 'white',
        },

        item: {
            padding: 10,
            fontSize: 18,
          },

          modalView: {
            backgroundColor:'white',
            width: 380,
            height: 240,
            borderColor:'#cccccc',
            margin:2,
            marginTop: 10,
            borderRadius:10,
            shadowOffset:{  width: 10,  height: 10,  },
            shadowColor: 'black',
            shadowOpacity: .8,
            justifyContent: 'flex-start',
            alignItems: 'center'
          }
});
