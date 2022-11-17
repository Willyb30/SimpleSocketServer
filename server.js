var express = require('express')
var app = express()
var http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/*', function (req, res) {
    console.log( "access" +req.url)

    var url = req.url.split('?')[0];
    console.log("url="+url);
    var splitted = url.split('/');
    if (splitted.length > 1) {
        console.log("splitted="+splitted.length);
        var page = splitted[1];
        var roomName = splitted[2];
        var peerId = splitted[3];
        

        if (io && page=="wss")
        {
            console.log("io is ok"); 
            var targetPeer = io.sockets.adapter.nsp.connected[peerId];
            if (!targetPeer) { //Try to find by nickname
                var room = io.sockets.adapter.rooms[roomName];
                if (room) {
                    for (var id in room) {
                        var peer = io.sockets.adapter.nsp.connected[id];
                        if (peer && peer.customProps && peer.customProps.nickName && peer.customProps.nickName == peerId)
                            targetPeer = peer;
                        console.log("targetPeer:" + targetPeer);
                    }
                }
            }
        }
    }

  res.sendFile(__dirname + '/index.html');
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
  
    socket.on('message', function(msg) {
      console.log("Received a message");
      io.emit('chat message', msg);
    });
  
  })


http.listen(process.env.PORT || 3000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});



