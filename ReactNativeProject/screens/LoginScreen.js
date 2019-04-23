import React from 'react';
import { View, 
  Text, 
  ScrollView, 
  StyleSheet, 
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
    // constructor(props) {
    //     super(props);
    //     this.state = { email: '' };
    //     this.handleEmailChange = this.handleEmailChange.bind(this);
    //     }

  static navigationOptions = {
    title: 'Login',
  };

  render() {
    return (
      <View>
        <Button title="Sign in!" onPress={this._signInAsync} />
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
        return accessToken;
      } else{
        return {cancelled: true};
      } 
  }catch(err) {
    return {error: true};
  }
}

  



}
  

  // handleEmailChange(email) {
  //   this.setState({ email: email });
  // }


  // render() {
  //   const {navigate} = this.props.navigation;
  //   return (
  //       <ScrollView>
  //           <View style={styles.inputContainer}>
  //               <TextInput
  //               style={styles.textInput}
  //               placeholder="Your email"
  //               maxLength={20}
  //               onBlur={Keyboard.dismiss}
  //               value={this.state.email}
  //               onChangeText={this.handleEmailChange}
  //               />
  //               <TouchableOpacity style={styles.saveButton} onPress={() => navigate('Home')}>
  //                   <Text style={styles.saveButtonText}>Sign in!</Text>
  //               </TouchableOpacity>
  //           </View>
  //       </ScrollView>
        // <View style={styles.container}>
        //     <Form 
        //         type={User}
        //         options={options}
        //         ref={c => this._form = c} 
        //     />
            
        // </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       paddingTop: 45,
//       backgroundColor: '#F5FCFF',
//     },
//     header: {
//       fontSize: 25,
//       textAlign: 'center',
//       margin: 10,
//       fontWeight: 'bold'
//     },
//     inputContainer: {
//         paddingTop: 15
//     },
//     textInput: {
//         borderColor: '#CCCCCC',
//         borderTopWidth: 1,
//         borderBottomWidth: 1,
//         height: 50,
//         fontSize: 25,
//         paddingLeft: 20,
//         paddingRight: 20
//     },
//     saveButton: {
//         borderWidth: 1,
//         borderColor: '#007BFF',
//         backgroundColor: '#007BFF',
//         padding: 15,
//         margin: 5
//       },
//       saveButtonText: {
//         color: '#FFFFFF',
//         fontSize: 20,
//         textAlign: 'center'
//       }
//   });

