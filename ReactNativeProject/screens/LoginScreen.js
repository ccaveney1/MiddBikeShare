import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
//import t from 'tcomb-form-native'; // 0.6.9

// const Form = t.form.Form;

// const User = t.struct({
//   email: t.String,
//   password: t.String,
//   terms: t.Boolean
// });

// const options = {
//     fields: {
//       email: {
//         error: 'Enter your Middlebury email'
//       },
//       password: {
//         error: 'Choose a password'
//       },
//       terms: {
//         label: 'Agree to Terms',
//       },
//     },
//   };

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '' };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        }

  static navigationOptions = {
    title: 'Login',
  };
  

  handleEmailChange(email) {
    this.setState({ email: email });
  }


  render() {
    const {navigate} = this.props.navigation;
    return (
        <ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.textInput}
                placeholder="Your email"
                maxLength={20}
                onBlur={Keyboard.dismiss}
                value={this.state.email}
                onChangeText={this.handleEmailChange}
                />
                <TouchableOpacity style={styles.saveButton} onPress={() => navigate('Home')}>
                    <Text style={styles.saveButtonText}>Sign in!</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        // <View style={styles.container}>
        //     <Form 
        //         type={User}
        //         options={options}
        //         ref={c => this._form = c} 
        //     />
            
        // </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 45,
      backgroundColor: '#F5FCFF',
    },
    header: {
      fontSize: 25,
      textAlign: 'center',
      margin: 10,
      fontWeight: 'bold'
    },
    inputContainer: {
        paddingTop: 15
    },
    textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
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

