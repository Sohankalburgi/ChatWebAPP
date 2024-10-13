import { connection } from "websocket";
import { OutgoingMessage } from "./messages/outgoingMessages";

interface User{
    name : string;
    id : string;
    conn : connection;
} 

 interface Room{
    users : User[]
}

export class UserManager{

    private rooms : Map<string,Room>;

    constructor(){
        this.rooms = new Map<string,Room>();
    }

    addUser(name: string, userId: string, roomId: string, socket: connection){
    
        if(!this.rooms.get(roomId)){
            this.rooms.set(roomId, {
                users:[]});
        }
        console.log(this.rooms)
        this.rooms.get(roomId)?.users.push({
            id : userId,
            name,
            conn: socket
        })
        console.log(this.rooms)
        socket.on('close', (reasonCode, description) =>{
            console.log((new Date()) + ' Peer ' + socket.remoteAddress + ' disconnected.');
            this.removeUser(roomId,userId);
        });
    }

    removeUser(roomId: string, userId: string){
        console.log('remove User')
        const users = this.rooms.get(roomId)?.users;
        
        if(users){
            users.filter(({id})=> id!==userId);
        }
    }

    getUser(roomId: string, userId: string):  User | null{
        const users = this.rooms.get(roomId)?.users;
        return users?.find(({id})=> id===userId) ?? null;
    }

    broadcast(roomId: string, userId: string, message: OutgoingMessage){
        
        console.log('outgoing message userid',userId);
        const user = this.getUser(roomId,userId);
        
        console.log('the user from outgoing',user);

        if(!user){
            console.error('User Not found');
            return;
        }
        const room = this.rooms.get(roomId);
        if(!room){
            console.error('Room Not Found');
            return;
        }
        
        if(message.type == 'GET_CHATS'){
            console.log('outgoing message',JSON.stringify(message));
            user.conn.sendUTF(JSON.stringify(message));
            return;
        }

       
        room.users.forEach( ({conn,id})=> {
            
            console.log("outgoing message", JSON.stringify(message))
            conn.sendUTF(JSON.stringify(message))
        } )
    }
}