import { Socket } from "socket.io"
import { RoomManager } from "./roomManager";

export interface User {
    name:string,
    socket:Socket,
}

export class UserManager{
    private users: User[];
    private queue: String[];
    private roomManager :RoomManager;
    constructor(){
        this.users=[]
        this.queue=[]
        this.roomManager=new RoomManager();
    }
    addUser(name:string ,socket:Socket){
        const copyUser = this.users.find((user)=>{
            return user.name === name
        })
        if(copyUser){
            socket.emit('connection-responce',{
                success:false,
                message:"User with given username already exists"
            })
        }
        else{
            this.users.push({
                name,socket
            })
            this.queue.push(socket.id)
            console.log("users:");
            this.users.forEach((user)=>{console.log(user.name)});
            console.log("active users:",this.queue)
            this.initHandlers(socket)
            socket.emit('connection-responce',{
                success:true,
                message:"Connected sucessfully"
            })
        }
    }
    removeUser(socketID:string){
        const user =this.users.find((x)=>x.socket.id === socketID)
        if(user)
        {
            this.users=this.users.filter((x)=>x.socket.id !== socketID)
            this.queue=this.queue.filter((x)=>x!== socketID)
            const roompeer =this.roomManager.removeUserRoom(user)
            if(roompeer){
                roompeer.socket.emit("peer-disconnected",{
                    message:"Opponent disconnected."
                })
                this.queue.push(roompeer.socket.id)
            }
        }
    }
    initHandlers(socket:Socket){
        socket.on("message",({message})=>{
            console.log("message recieved:",message)
            this.roomManager.onMessage(message);
        })
        socket.on("challenge",({opponentName})=>{
            console.log(opponentName)
            const challenger = this.users.find((user)=>user.socket.id===socket.id);
            if(!challenger) return;
            const opponent = this.users.find((user)=>user.name===opponentName);
            if(!opponent){
                socket.emit('challenge-responce',{
                    success:false,
                    message:`User with username ${opponentName} not found.`
                })
                return;
            }
            const available = this.queue.includes(opponent.socket.id);
            if(!available){
                socket.emit('challenge-responce',{
                    success:false,
                    message:`${opponentName} might already be in a challenge.`
                })
                return;
            }
            this.queue = this.queue.filter((id)=>{return (id!==opponent.socket.id && id!==challenger.socket.id)})
            opponent.socket.emit('challenge',{challengerName:challenger.name})
        })
        socket.on("challenge-responce",({accept,challengerName})=>{
            const challenger = this.users.find((user)=>user.name===challengerName);
            const acceptor = this.users.find((user)=>user.socket.id===socket.id);
            if(!acceptor) return;
            if(!challenger)
            {
                socket.emit('challenge-responce',{
                    success:false,
                    message:`User with username ${challengerName} might have left.`
                })
                this.queue.push(socket.id)
                return;
            }
            if(!accept)
            {
                this.queue.push(socket.id)
                this.queue.push(challenger.socket.id)
                challenger.socket.emit('challenge-responce',{
                    success:false,
                    message:`${acceptor.name} denied the challenge`
                })
                return;
            }

            challenger.socket.emit('challenge-responce',{
                success:true,
                message:`${acceptor.name} accpted the challenge`
            })
            this.roomManager.createRoom(acceptor,challenger);
        })
        socket.on('move',({roomId,sign,index})=>{
            this.roomManager.onMove(index,sign,roomId);
        })
        socket.on("rematch-challenge",({roomId})=>{
            const room = this.roomManager.getRoom(roomId);
            if(room){
                const challenger = (room.user1.socket.id===socket.id)?room.user1:room.user2;
                const opponent = (room.user1.socket.id===socket.id)?room.user2:room.user1;
                opponent.socket.emit('rematch-challenge',{challengerName:challenger.name})
            }
            else{
                socket.emit('peer-disonnected',{
                    message:"Opponent left the room"
                })
            }
        })
        socket.on("rematch-challenge-responce",({accept,roomId})=>{
            const room = this.roomManager.getRoom(roomId);
            if(room){
                const acceptor = (room.user1.socket.id===socket.id)?room.user1:room.user2;
                const challenger = (room.user1.socket.id===socket.id)?room.user2:room.user1;
                if(!accept)
                {
                    this.queue.push(socket.id)
                    this.queue.push(challenger.socket.id)
                    challenger.socket.emit('rematch-challenge-responce',{
                        success:false,
                        message:`${acceptor.name} denied the rematch`
                    })
                    this.roomManager.deleteRoom(roomId)
                    return;
                }
                challenger.socket.emit('rematch-challenge-responce',{
                    success:true,
                    message:`${acceptor.name} accpted the rematch`
                })
                this.roomManager.resetRoom(roomId);
            }
        })
        socket.on('go-back',({roomId})=>{
            const room = this.roomManager.getRoom(roomId);
            if(room){
                const acceptor = (room.user1.socket.id===socket.id)?room.user1:room.user2;
                const challenger = (room.user1.socket.id===socket.id)?room.user2:room.user1;   
                this.queue.push(socket.id)
                this.queue.push(challenger.socket.id)
                challenger.socket.emit('peer-disconnected',{
                    message:`Opponent left room`
                })
                this.roomManager.deleteRoom(roomId)
            }
        })
    }
}