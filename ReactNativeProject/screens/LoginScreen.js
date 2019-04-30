import React from 'react';
import { View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  AsyncStorage,
  Button } from 'react-native';
import { Google } from 'expo';



export default class LoginScreen extends React.Component {


  static navigationOptions = {
    title: 'Please sign in',
  };

  static navigationOptions = {
    title: 'Login',
  };

  render() {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Image source={require('./bike.png')} />
        <Text style={{color: 'black', fontSize: 24, fontFamily: 'GillSans-Bold', lineHeight: 50}}>
        Middlebury Bikeshare
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={this._signInAsync}>
            <Text style={styles.saveButtonText}>Sign In!</Text>
        </TouchableOpacity>
      </View>
    );
  }
  _signInAsync = async () => {
    const clientId = '108117962987-96atlk0mjo5re9nasjarq2a7m7gnfbub.apps.googleusercontent.com';
    try {
      const { type, accessToken, user } = await Google.logInAsync({ clientId });
      if (type === 'success') {
        /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
        this.props.navigation.navigate('App');
        await AsyncStorage.setItem('userToken', accessToken);
        this.saveUser(user);
        return accessToken;
      } else{
        return {cancelled: true};
      }
  }catch(err) {
    return {error: true};
  }
}

saveUser = async (user) => {
  try {
    const response = await fetch('http://127.0.0.1:3000/users/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: user.givenName,
        last_name: user.familyName,
        email: user.email,
        strikes: 0
      })
    });
    const responseJson = await response.json();
    console.log(responseJson);
    await AsyncStorage.setItem('email', responseJson.user.email);
    await AsyncStorage.setItem('first_name', responseJson.user.first_name);
    await AsyncStorage.setItem('user_id', responseJson.user._id);

    return responseJson;
  }
  catch (error) {
    console.error(error);
  }
};






}
const styles = StyleSheet.create({
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
  })
