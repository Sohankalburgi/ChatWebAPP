import { connection, server as WebSocketServer } from 'websocket';
import  http from 'http';
import { IncomingMessage, SupportMessage } from './messages/incomingMessages';
import { UserManager } from './UserManagement';
import { InMemoryStore } from './store/InMemoryStore';
import { OutgoingMessage, SupportMessage as OutgoingSupportMessages } from './messages/outgoingMessages'

var server = http.createServer(function(request:any, response:any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

const userManager = new UserManager();
const store = new InMemoryStore();

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin:string) {
  return true;
}

wsServer.on('request', function(request) {
    console.log("inside connect")
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        // TODO add the rate limiting logic here
        if (message.type === 'utf8') {
            try{
                console.log("indie with message ",message.utf8Data);
                messageHandler(connection,JSON.parse(message.utf8Data));
            }catch(e) {
                console.error(e)
            }
            
            // console.log('Received Message ', message.utf8Data);
            // connection.sendUTF(message.utf8Data);

        }
        
    });
    
});

function messageHandler(ws : connection,message : IncomingMessage){
    console.log("Incoming message ",JSON.stringify(message))
    
    if(message.type == SupportMessage.JoinRoom){
        console.log('first')
        const payload = message.payload;
        userManager.addUser(payload.name,payload.userId,payload.roomId,ws);
    }

    if(message.type == SupportMessage.SendMessage){
        console.log('second')
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId,payload.userId);
        if(!user){
            console.error('User Not Found in the database');
            return;
        }
        const chat = store.addChat(payload.userId,user.name, payload.roomId,payload.message);
        // todo Add the broadcast logic here

        if(!chat){
            return;
        }

        const outgoingPayload : OutgoingMessage = {
            type : OutgoingSupportMessages.AddChat,
            payload : {
                chatId : chat.id,
                roomId : payload.roomId,
                message : payload.message,
                name : user.name,
                upvotes : 0,
            }
        }
       
        userManager.broadcast(payload.roomId,payload.userId,outgoingPayload);

    }

    if(message.type == SupportMessage.UpvoteMessage){
        console.log('third')
        const payload = message.payload;
        const chat = store.upvote(payload.userId,payload.roomId,payload.chatId);
        console.log('the chat is from upvote',chat)
        if(!chat){
            return ;
        }

        const outgoingPayload : OutgoingMessage = {
            type : OutgoingSupportMessages.UpdateChat,
            payload : {
                chatId : chat.id,
                roomId : payload.roomId,
                upvotes : chat.upvotes.length,
            }
        }

        userManager.broadcast(payload.roomId,payload.userId,outgoingPayload);
    }

    if(message.type == SupportMessage.GetMessages){
        console.log('fourth');
        const payload = message.payload;
        console.log('this is fourth ',message)
        const chats = store.getChats(payload.roomId,payload.limit, payload.offset);
        console.log(chats)
        if(!chats){
            return;
        }

        const outgoingPayloadChats:any = [];
        chats.forEach((chatItem) => {
            outgoingPayloadChats.push({
                chatId : chatItem.id,
                roomId : payload.roomId,
                message : chatItem.message,
                name : chatItem.userId,
                upvotes : chatItem.upvotes.length,
            })
        })


        const outgoingPayload : OutgoingMessage = {
            type : OutgoingSupportMessages.GetChats,
            payload : outgoingPayloadChats
        }

        userManager.broadcast(payload.roomId,payload.userId,outgoingPayload);

    }
}