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
  state = {
      bikes: [],
      users: [],
      bikeSelected: null,
      modalVisible: false,
  };

  componentDidMount() {
    this.getBikes(bikes => {
      this.setState({bikes})});
}

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

  getUsers = () => {};

  getRentals = () => {};

  makeAdmin = () => {};

  addStrike = () => {};

  updateBikeStatus = () => {};

  updateBikeLocation = () => {};

  updateBikeUser = () => {};

  addBike = () => {};

  deleteBike = () => {};

  deleteUser = () => {};

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  }

  BikeItem = (item) => {
      return(
        <View>
            <Text style={styles.item} i={item} onPress={() => {
                console.log(this.i);
                console.log("break");
                this.setState({bikeSDataTransferItemListelected: i});
                this.setState({modalVisible: true});
                console.log(this.state.bikeSelected);
                }} > 
                Bike Number {item.label}, {item.status}
            </Text>
            {/* <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    >
                    <View style={styles.modal}>
                    <View style={styles.modalView}>
                        <Text>hey</Text>
                    </View>
                    </View>
    
                </Modal>
            </View> */}
        </View>
      );

  }


//   GetItem = (item) => { 
//     console.log(item);
//     this.setState({modalVisible: true});
//   }

BikeModal = (item) => (
    <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            >
            <View style={styles.modal}>
            <View style={styles.modalView}>
                <Text>hey</Text>
            </View>
            </View>

    </Modal>
)

  keyExtractor = (item) => item._id;

//   DisplayModal = (props) => (
//     <Modal visible={ props.display } animationType = "slide" 
//            onRequestClose={ () => console.log('closed') }>>
//       <View>
//         <Image 
//           source = { props.image } 
//           style = { styles.image } />
//         <Text style = { styles.text }>
//           { props.data }
//         </Text>
//       </View>
//     </Modal>
//   )
  

  
    render() {
      return (
        <View style={styles.MainContainer}>
  
       <FlatList
          data={ this.state.bikes }   
          ItemSeparatorComponent = {this.FlatListItemSeparator}
          keyExtractor={this.keyExtractor}
          renderItem={({item}) => this.BikeItem(item)}
        />

        

        </View>
      );
    }
  }




const styles = StyleSheet.create({
    MainContainer :{
 
        // Setting up View inside content in Vertically center.
        justifyContent: 'center',
        flex:1,
        margin: 10
         
        },
         
        item: {
            padding: 10,
            fontSize: 18,
            height: 44,
          },
          modal: {
            flex:1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // borderColor:'#cccccc',
            // margin:2,
            // borderRadius:10,
            // shadowOffset:{  width: 10,  height: 10,  },
            // shadowColor: 'black',
            // shadowOpacity: 1.0,
            // backgroundColor:'#fff',
          },
        
          modalView: {
            backgroundColor:'#fff',
            width: 350,
            height: 300,
            borderColor:'#cccccc',
            margin:2,
            borderRadius:10,
            shadowOffset:{  width: 10,  height: 10,  },
            shadowColor: 'black',
            shadowOpacity: .8,
            justifyContent: 'center',
            alignItems: 'center'
          }
});