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



export default class UsersComponent extends React.Component {
//   static navigationOptions = {
//     title: 'Admin Page',
//     header: null,
//   };

  constructor(props) {
    super(props);
    this.navigate = this.props.navigation.navigate;
    this.mounted = false;
  }
  state = {
      users: [],
      user_id: null,
  };



  componentDidMount() {
    this.mounted=true;
    this.getUsers(users => {
      if(this.mounted){
        this.setState({users});
      }
    });
    AsyncStorage.getItem('user_id').then((user_id) => {this.setState({user_id})});
  }


  componentDidUpdate() {
    this.getUsers(users => {
        if(this.mounted){
          this.setState({users});
        }
      });
  }

  componentWillUnmount() {
    this.mounted=false;
  }


  getUsers = (cb) => {
      if(this.mounted){
        return fetch('https://midd-bikeshare-backend.herokuapp.com/users/')
        .then((response) => response.json())
        .then((responseJson) => {
            let users = responseJson.users;
            cb(users);
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


  makeAdmin = (userId, admin) => {
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

  updateStrikes = (userId, addBool) => {
    this.getUserObject(userId, (user) => {
        console.log(user);
        let strikes = user.strikes;
        console.log(strikes);
        if(addBool) {
            strikes = strikes + 1;
        }else{
            strikes = strikes - 1;
        }
        console.log(strikes);
        let url = 'https://midd-bikeshare-backend.herokuapp.com/users/'.concat(userId);
        return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            strikes: strikes,
        })
        });
    })
  };


  deleteUser = (user) => {
    let url = 'https://midd-bikeshare-backend.herokuapp.com/users/'.concat(userId);
    return fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
  };


  keyExtractor = (item) => item._id;

  UserItem = (item) => {
    return(
      <View style={styles.modalView}>
            <Text style={styles.item}> 
                {item.last_name}, {item.first_name}
            </Text>
            <Text> 
                {item.email}
            </Text>
            <Text>Strikes: {item.strikes}</Text>
            <View style={{flex:1, flexDirection: 'row'}}>
                <TouchableHighlight
                    onPress={()=>this.updateStrikes(item._id, true)}
                    style={styles.buttonStyle}
                    >
                    <Text>Add</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={()=>this.updateStrikes(item._id, false)}
                    style={styles.buttonStyle}
                    >
                    <Text>Subtact</Text>
                </TouchableHighlight>
            </View>
            <Text>Admin Privileges: {item.admin}</Text>
            <View style={{flex:1, flexDirection: 'row'}}>
                <TouchableHighlight 
                style={styles.buttonStyleLocation}
                onPress={()=>{
                    Alert.alert(
                        item._last_name + ', ' + item.first_name,
                        'Would you like to update user\'s admin privileges to '+ !item.admin + '?',
                        [
                            {text: 'Yes', onPress: () => {
                                this.updateStrikes(item._id, !item.admin);
                            }},
                            {
                            text: 'No',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                            }
                        ],
                        {cancelable: false},
                    )
                    }}>
                        <Text>Change Privileges</Text>
                </TouchableHighlight>
            </View>
            
            <TouchableHighlight style={styles.buttonStyleLocation}
            onPress={() => {
                if(item._id != this.state.user_id){
                    Alert.alert(
                        item._last_name + ', ' + item.first_name,
                        'Are you sure you would like to remove this user from the database?',
                        [
                            {text: 'Yes', onPress: () => {
                              this.deleteUser(item._id);
                            }},
                            {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                            }
                        ],
                        {cancelable: false},
                  )
                }else{
                    Alert.alert(
                        'Oops',
                        'Can\'t remove yourself from the database!',
                        [
                            {text: 'OK', onPress: () => {
                            }}
                        ],
                        {cancelable: false},
                  )
                }
              
            }}
            >
              <Text style={styles.buttonText}>Remove User</Text>
            </TouchableHighlight>
      </View>
    );

}


  
    render() {
      return (
        <View style={{flex:1, justifyContent:'center', backgroundColor: 'purple'}}>
        <View style={styles.MainContainer}>

        <Text style = {{fontSize:24, color: 'white', padding:10}}>Manage Users</Text>
  
       <FlatList
          data={ this.state.users }   
          keyExtractor={this.keyExtractor}
          renderItem={({item}) => this.UserItem(item)}
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
        },
        buttonStyleHighlight :{
          height: 30,
          width: 80,
          backgroundColor: 'navy',
          margin:5,
          alignItems: 'center',
          justifyContent: 'center',
        },

        buttonStyleLocation :{
          height: 30,
          width: 240,
          backgroundColor: 'purple',
          marginBottom:10,
          alignItems: 'center',
          justifyContent: 'center',
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