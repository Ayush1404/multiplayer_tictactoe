import { User } from "./userManager";
let GLOBAL_ROOM_ID =1;
interface Room{
    user1:User,
    user2:User,
    currPlayer:'X'|'O'
    board:Array<string|null>,
    winner:string|null
    chatbox :Message[]
}
interface Message {
    roomId:number,
    data:string,
    senderName:string
}
const calculateWinnerStatus = (board:Array<string|null>) => {
    const winPatterns = [
      [0, 1, 2], 
      [3, 4, 5], 
      [6, 7, 8], 
      [0, 3, 6], 
      [1, 4, 7], 
      [2, 5, 8],  
      [0, 4, 8], 
      [2, 4, 6], 
    ];
      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === board[b] && board[a] === board[c] && board[a]!==null) {
          return board[a];
        }
      }
      if(board.every((cell)=>cell!==null))
      {
        return 'D'
      }
      return null;
};
export class RoomManager{
    private rooms: Map<string,Room>
    
    constructor(){
        this.rooms=new Map<string,Room>()
    }
    getRoom(roomId:string){
        const room =this.rooms.get(roomId)
        return room;
    }
    removeUserRoom(user:User){
        let _roompeer;
        for(let [roomId,room] of this.rooms)
        {
            if(user.socket.id === room.user1.socket.id )
            {
                _roompeer=room.user2;
                this.deleteRoom(roomId)
            }
            else if(user.socket.id === room.user2.socket.id)
            {
                _roompeer=room.user1;
                this.deleteRoom(roomId)
            }
        }
        return _roompeer;
    }
    createRoom(user1:User, user2:User){
        const roomId = this.generateRoomId().toString(); 
        const roomData = {
            roomId,
            user1:user1.name,
            user2:user2.name,
            currPlayer:'X',
            board:new Array<string|null>(9).fill(null),
            winner:null,
            chatbox:[]
        }
        this.rooms.set(roomId,{
            user1,
            user2,
            currPlayer:'X',
            board:new Array<string|null>(9).fill(null),
            winner:null,
            chatbox:[]
        })
        user1.socket.emit('join-room',roomData)
        user2.socket.emit('join-room',roomData)
    }
    
    deleteRoom(roomId:string){
        this.rooms.delete(roomId);
    }
    resetRoom(roomId:string){
        const roomdata = this.rooms.get(roomId);
        if(roomdata)
        {
            this.rooms.set(roomId,{
                user1:roomdata.user2,
                user2:roomdata.user1,
                currPlayer:'X',
                board:new Array<string|null>(9).fill(null),
                winner:null,
                chatbox:[]
            })
            const roomData = {
                roomId,
                user1:roomdata.user2.name,
                user2:roomdata.user1.name,
                currPlayer:'X',
                board:new Array<string|null>(9).fill(null),
                winner:null,
                chatbox:roomdata.chatbox
            }
            roomdata.user1.socket.emit('join-room',roomData)
            roomdata.user2.socket.emit('join-room',roomData)
        }
    }
    onMessage(message:Message){
        const room = this.rooms.get(message.roomId.toString());
        if(room) 
        {
            room.chatbox.push(message);
            const {user1,user2} = room;
            user1?.socket.emit("update-chatbox",{
                chatbox:room.chatbox
            })
            user2?.socket.emit("update-chatbox",{
                chatbox:room.chatbox
            })
        }
    }
    onMove(index:number,sign:string,roomId:string){
        const room = this.rooms.get(roomId.toString());
        if(room) 
        {
            if(room.currPlayer!=sign || room.board[index]!=null || room.winner!==null)return;
            room.board[index]=sign;
            const status = calculateWinnerStatus(room.board)
            room.winner = status;
            room.currPlayer=(room.currPlayer==='X')?'O':'X';
            const {user1,user2} = room;
            user1?.socket.emit("update-board",{
                board:room.board,
                winner:status,
                currPlayer:room.currPlayer,
            })
            user2?.socket.emit("update-board",{
                board:room.board,
                winner:status,
                currPlayer:room.currPlayer,
            })
        }
    }
    generateRoomId(){
        return GLOBAL_ROOM_ID++;
    }
}