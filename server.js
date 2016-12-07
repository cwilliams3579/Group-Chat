
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 3000;
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection',function (socket) {
   console.log('Socket.io connnected');

   socket.emit('message',{
      name: 'Time',
      text:'Welcome',
      timestamp: moment().valueOf()
   });

   socket.on('joingroup',function (request) {
      clientInfo[socket.id] = request;
      socket.join(request.group);
      socket.broadcast.to(request.group).emit('message',{
         name: 'system',
         text:request.name + ' joined group ' + request.group,
         timestamp: moment().valueOf()
      });

   });

   socket.on('disconnect',function () {
      if(typeof clientInfo[socket.id] !== 'undefined'){
         socket.leave(clientInfo[socket.id]);
         io.to(clientInfo[socket.id].group).emit('message',{
            name: 'system',
            text: clientInfo[socket.id].name + ' left group ' + clientInfo[socket.id].group,
            timestamp: moment().valueOf()
         });
         delete clientInfo[socket.id];
      }
   });


   socket.on('message',function (message) {
      console.log('Message recieved : '+message.text);
      message.timestamp = moment().valueOf();

      io.to(clientInfo[socket.id].group).emit('message',message);

   });

});

http.listen(PORT,function () {
   console.log('Server Port : ' + PORT);
});
