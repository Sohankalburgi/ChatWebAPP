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

        this.rooms.get(roomId)?.users.push({
            id : userId,
            name,
            conn: socket
        })
    }

    removeUser(roomId: string, userId: string){
        const users = this.rooms.get(roomId)?.users;
        
        if(users){
            users.filter(({id})=> id!=userId);
        }
    }

    getUser(roomId: string, userId: string):  User | null{
        const users = this.rooms.get(roomId)?.users;
        return users?.find(({id})=> id===userId) || null;
    }

    broadcast(roomId: string, userId: string, message: OutgoingMessage){
        const user = this.getUser(roomId,userId);
        if(!user){
            console.error('User Not found');
            return;
        }
        const room = this.rooms.get(roomId);
        if(!room){
            console.error('Room Not Found');
            return;
        }

        console.log("outgoing message", JSON.stringify(message))
        room.users.forEach( ({conn})=> {
            conn.sendUTF(JSON.stringify(message.payload))
        } )
    }
}