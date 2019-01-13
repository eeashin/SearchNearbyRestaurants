import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { MapView } from 'expo';
import Geocoder from 'react-native-geocoding';

Geocoder.setApiKey('AIzaSyC17oKKhMLx2hFNDhBWpDsSiTIqleJN_fE');
//required google geocoder Api key, obtained from google
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      myAddress: '',
      latitude:61.9241,
      longitude:25.7482,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0221,
      restaurants:null,
    }    
  }
  
  findMyAddress = () =>{

    Geocoder.setApiKey('AIzaSyC17oKKhMLx2hFNDhBWpDsSiTIqleJN_fE'); 
    Geocoder.getFromLocation(this.state.myAddress)
    .then((responseData) => {
        const location = responseData.results[0].geometry.location;
        this.setState({
          longitude:location.lng,
          latitude: location.lat
        })
        this.getRestaurants();
      },
      error => {
        Alert.alert(error);
      }
      
    );  
  }

  REQ_URL =(lat,long,radius,type,API) =>{
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const location = `location=${lat},${long}&radius=${radius}`;
    const typeData = `&types=${type}`;
    const key = `&key=${API}`
    return `${url}${location}${typeData}${key}`

  }
  getRestaurants = () =>{
    const url = this.REQ_URL(this.state.latitude,this.state.longitude,500,'restaurant','AIzaSyC59alra_xKc0X1iagtCPnmBK2jnKqYxH4') //google place enabled api 
    fetch(url)
      .then((response) => response.json())
      .then((responseJSON) => { 
        const markers = [];
        responseJSON.results.map((marker, k)=>{
          markers.push(
            <MapView.Marker
              key={k}
              coordinate={{
                latitude: marker.geometry.location.lat,
                longitude: marker.geometry.location.lng,
              }}
              title= { marker.name}
              description={ marker.formatted_address}
            />
          )
        })
        this.setState({restaurants: markers});
      })
    .catch((error) => { 
      Alert.alert(error); 
    });  
  }
  render() {
    return (
      <View style={styles.container}>

        <MapView
            style={styles.map}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta,
            }}>
               {this.state.restaurants}
               
        </MapView>
        <View style={styles.wrapperInput}>
            <TextInput style={styles.inputSearch}  onChangeText={(myAddress) => this.setState({myAddress})} value={this.state.myAddress}/>
            <Button onPress={this.findMyAddress} title="SHOW"/>
        </View>          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 80,
  },
  wrapperInput:{
    flex:20
  },
  inputSearch:{
    height: 36,
    padding: 10,
    margin: 18,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    backgroundColor: 'rgba(0,0,0,0)',
  }
});