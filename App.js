import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,  
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import throttle from "lodash.throttle";
import uuid from "uuid/v4";

import io from "socket.io-client";
console.ignoredYellowBox = [
  'Setting a timer'
];

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
  Typing: {
    padding: 10, 
    marginBottom: 10, 
    justifyContent: 'center', 
    flex: 1, 
    flexDirection: 'row'
  },  
  btnLogin: {
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5
  }
});

const Message = ({item, self}) => {
  const margin = self ? '5%' : 0;
  return (
    <View style={[Styles.Message, {marginLeft: margin}]}>
      <Text style={{fontWeight: 'bold', color: '#8cdba4'}}>{item.author}</Text>
      <Text>{item.text}</Text>
    </View>
  )
}

class Typing extends React.Component {
  render() {
    return (
      <View style={Styles.Typing}>
        <Text>Ktoś właśnie pisze ...</Text>
      </View>
    )
  }
}

class ChatScreen extends React.Component {
  
    keyExtractor = (item) => item.id;
    typingTimeout = 0;
  
    constructor(props) {
      super(props);
  
      this.state = {
        userName: this.props.navigation.state.params.user,
        userId: uuid(),
        text: '',
        typing: false,
        items: []      
      }         
    }

    componentDidMount() {
      this.socket = io('http://147.135.192.225:8080', {jsonp: false});
  
      this.socket.on('connect', () => {                                                                            
        console.log('connected');
      });
  
      this.socket.on('echo', (data) => {
        this.setState({
          items: [
            ...this.state.items,
            data
          ],
          typing: false
        }, () => this.list.scrollToEnd());
      });

      this.socket.on('typing', () => {
        this.setState({
          typing: true
        });
  
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
          this.setState({
            typing: false
          })
        }, 5000)
      })      
    }    

    componentWillUnmount() {
      this.socket.close();
    }

    handleTextChange = (text) => {
      this.setState({
        text
      }, () => {
        this.handleTyping();
      });
    }  

    handleTyping = throttle(() => {
      console.log('send typing');
      this.socket.emit('typing'); 
    }, 3000, { trailing: false });    
  
    handleSubmit = () => {
      if(this.state.text) {
        const payload = {
          author: this.state.userName,
          user: this.state.userId,
          text: this.state.text
        };
  
        this.socket.emit('msg', payload);
  
        this.setState({
          text: ''
        });
      }
    } 

    getItems = () => {
      const items = [
        ...this.state.items,       
      ];
      if(this.state.typing) items.push({ type: 'special', 'id': 'typing'});
  
      return items;
    }    
    
    renderItem = ({item}) => {
      if(typeof item.type === 'undefined') return <Message item={item} self={item.user === this.state.userId} />;
      else return <Typing />
    }   

    setRef = (el) => this.list = el;
    render() {
      return (
        <View style={{backgroundColor: '#e6e2df', flex: 1}}>
          <FlatList
            ref={this.setRef}
            style={{padding: 10, flex: 1}}          
            data={this.getItems()}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />   
          <KeyboardAvoidingView behavior={'padding'} style={{backgroundColor: '#f5f1ee'}}>
            <View style={{backgroundColor: 'white', padding: 5, margin: 10}}>
              <TextInput 
                value={this.state.text}
                underlineColorAndroid={'transparent'} 
                autoCorrect={false}
                onSubmitEditing={this.handleSubmit}
                onChangeText={this.handleTextChange} />
            </View>  
          </KeyboardAvoidingView>               
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
      this.props.navigation.navigate('Chat', { user: this.state.name })
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
              autoCorrect={false}
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

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      header: null
    })
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: () => ({
      header: null
    })    
  }
});

export default RootNavigator;