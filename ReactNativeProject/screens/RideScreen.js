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


export default class RideScreen extends React.Component {
  static navigationOptions = {
    title: 'You\'re Riding!',
    header: null,
  };

  endRide = () => {
    this.props.navigation.navigate('Home');
    };


  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.saveButton} onPress={() => {
                  this.endRide();
                  }}>
                  <Text style={styles.saveButtonText}>END IT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={()=>Alert.alert(
                'Bike Number 3244',
                'Are you sure you would like to report this bike as Missing?',
                [
                    {text: 'Yes', onPress: () => this.endRide()},
                    {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                    }
                ],
                {cancelable: false},
        )}>
                    <Text style={styles.saveButtonText}>Report Missing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={()=>Alert.alert(
                'Bike Number 3244',
                'Are you sure you would like to report this bike as Damaged?',
                [
                    {text: 'Yes', onPress: () => this.endRide()},
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