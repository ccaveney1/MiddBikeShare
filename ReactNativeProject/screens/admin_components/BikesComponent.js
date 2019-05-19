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

  static navigationOptions = {
    title: 'Manage Bikes',
    header: null,
  };

  state = {
      bikes: [],
      latitude: null,
      longitude: null,
      labelInputText: '',
  };



  componentDidMount() {
    this.mounted=true;
    this.getBikes(bikes => {
      if(this.mounted){
        this.setState({bikes});
      }
    });
  }


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

  // get current location with permissions
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

  deleteBike = () => {};



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
            <TouchableHighlight style={styles.buttonStyleLocation}>
              <Text style={styles.buttonText}>Remove Bike</Text>
            </TouchableHighlight>
        </View>
      );

  }




  keyExtractor = (item) => item._id;


  
    render() {
      return (
        <View style={{flex:1, justifyContent:'center', backgroundColor: 'purple'}}>
        <View style={styles.MainContainer}>

      <Text style = {{fontSize:24, color: 'white', paddingTop:30}}>Manage Bikes</Text>

      <TouchableHighlight style={styles.buttonStyleAdd}>
          <Text style={styles.buttonText}>Add a Bike</Text>
      </TouchableHighlight>
      <TextInput
            placeholder='Label'
            style={{height: 20, borderColor: 'white', backgroundColor:'white', borderWidth: 2}}
            onChangeText={(text) => this.setState({labelInputText: text})}
            value={this.state.labelInputText}
            maxLength = {2}
          />
      
  
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