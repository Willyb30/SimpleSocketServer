var express = require('express')
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('*', function (req, res) {
    console.log( "access" +req.url)
  res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

io.sockets.on('connection', function (client) {
    console.log("connection :")
});

io.on('connection', function(socket) {
  console.log('Client connected to the WebSocket');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('chat message', function(msg) {
    console.log("Received a chat message");
    io.emit('chat message', msg);
  });
})