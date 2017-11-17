import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity 
} from 'react-native';

const Styles = StyleSheet.create({
  Login: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#317eac'
  },
  btnLogin: {
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5
  }
});


class HomeScreen extends React.Component {

  state = {
    name: ''
  }

  handleNameChange = (name) => {
    this.setState({
      name
    })
  }  

  handleSubmit = () => {
    if(this.state.name.length >= 3) {
      alert(`Witaj ${this.state.name}`);
    }
  }

  render() {
    return (
        <View style={Styles.Login}>
          <View>
            <Text style={{color: 'white'}}>
              Witaj           
            </Text>
          </View>
          <View style={{width: 150, marginLeft: 10}}>
            <TextInput 
              value={this.state.name} 
              underlineColorAndroid={'white'} 
              style={{color: 'white'}} 
              onChangeText={this.handleNameChange}              
            />
          </View>
          <TouchableOpacity onPress={this.handleSubmit}>
            <View style={Styles.btnLogin}>
              <Text style={{color: 'white'}}>Start!</Text>
            </View>
          </TouchableOpacity>
        </View>
         
    )
  }
}

export default HomeScreen;