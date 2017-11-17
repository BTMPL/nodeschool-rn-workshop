const io = require('socket.io')(8080);                                                                        
const uuid = require('uuid/v4');

io.on('connection', function (socket) {                                                                     
  console.log('Client connected', new Date());
  socket.emit('echo', {
    id: uuid(),
    author: 'System',
    text: 'Witaj na warsztatach Node School :)'
  });
  socket.on('msg', function (data) {                                                                      
    console.log('incomming', data);
    io.emit('echo', Object.assign({}, data, {
      id: uuid(),
      date: new Date
    }));
  }); 
  
  socket.on('typing', function() {
    socket.broadcast.emit('typing', {});
  })
});   