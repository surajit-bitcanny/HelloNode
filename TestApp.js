/**
 * Created by bitcanny on 27/4/17.
 */

var http = require('http');
var net = require('net');

console.log("Program Started...");

/*http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');*/


var chatServer = net.createServer()
var clientList = [];
chatServer.on('connection', function(client) {
    client.name = client.remoteAddress + ':' + client.remotePort
    client.write('Hi ' + client.name + '!\n');

    clientList.push(client);

    client.on('data', function(data) {
        console.log(data)
        broadcast(data, client)
    });

    client.on('end', function() {
        clientList.splice(clientList.indexOf(client), 1)
    })

    client.on('error', function(e) {
        console.log(e)
    })

    //client.write('Bye!\n');
    //client.end()
});

function broadcast(message, client) {
    var cleanup = [];
    for(var i=0;i<clientList.length;i+=1) {
        if(client !== clientList[i]) {
            if(clientList[i].writable) {
                clientList[i].write(client.name + " says " + message)
            } else {
                cleanup.push(clientList[i])
                clientList[i].destroy()
            }
        }
    }
}

chatServer.listen(9000);


console.log("Program Ended...");



