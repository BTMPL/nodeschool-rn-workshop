import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';

const Styles = StyleSheet.create({
  Message: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 10,
    maxWidth: '95%'
  },  
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

const Message = ({item}) => {
  return (
    <View style={Styles.Message}>
      <Text style={{fontWeight: 'bold', color: '#8cdba4'}}>{item.author}</Text>
      <Text>{item.text}</Text>
    </View>
  )
}

const items = [
  {
    id: 1,
    author: 'BTM',
    text: 'Witaj na Node School!'
  },
  {
    id: 2,
    author: 'BTM',
    text: 'Ooops, ucieło nam wiadomość ;)'
  }  
];

class ChatScreen extends React.Component {
  
    keyExtractor = (item) => item.id;
  
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <View style={{backgroundColor: '#e6e2df', flex: 1}}>
          <FlatList
            ref={this.setRef}
            style={{padding: 10, flex: 1}}          
            data={items}
            renderItem={Message}
            keyExtractor={this.keyExtractor}
          />          
        </View>
      );
    }
  }


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

export default ChatScreen;