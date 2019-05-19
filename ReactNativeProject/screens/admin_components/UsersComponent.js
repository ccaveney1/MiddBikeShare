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
      latitude: null,
      longitude: null,
  };



  componentDidMount() {
    this.mounted=true;
    this.getUsers(users => {
      if(this.mounted){
        this.setState({users});
      }
    });
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

  UserItem = (item) => {
    return(
      <View style={styles.modalView}>
          <Text style={styles.item}> 
              User Name
          </Text>
      </View>
    );

}


  
    render() {
      return (
        <View style={{flex:1, justifyContent:'center', backgroundColor: 'purple'}}>
        <View style={styles.MainContainer}>
  
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