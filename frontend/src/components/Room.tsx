import React from 'react';
import { useEffect, useState } from "react"
import Board from "./Board"
import ChatBox from "./Chatbox"
import { Socket } from "socket.io-client"
import ChallengeAlert from "./ChallengeAlert"

export type roomProps ={
    socket:Socket,
    userName:string,
    notifyMessage:string,
    setNotifyMessage:React.Dispatch<React.SetStateAction<string>>,
    setNotifyAlertOpen:React.Dispatch<React.SetStateAction<boolean>>
}
export interface Message {
    roomId:number,
    data:string,
    senderName:string
}


const Room = ({userName,socket,setNotifyAlertOpen,setNotifyMessage}:roomProps) => {
    const [currPlayer,setCurrPlayer] = useState("")
    const [winner,setWinner]=useState(null)
    const [rematchChallenge,setRematchChallenge]=useState(false)
    const [challengerName,setChallengerName]=useState("")
    const [opponentName,setOpponentName]=useState("")
    const [challengeAlertOpen, setChallengeAlertOpen] = useState(false);
    const [inGame,setInGame]=useState(false)
    const [roomId,setRoomId]=useState<number>(-1)
    const [newMessage,setNewMessage]=useState<Message>({roomId:-1,data:"",senderName:""})
    const [chatbox,setChatbox]=useState<Message[]>([])
    const [board,setBoard]=useState(Array<string|null>(9).fill(null))
    const [mySign,setMySign]=useState("")
    const sendChallenge=(opponentName:string)=>{
        if(socket)
        {
            socket.emit("challenge",{opponentName})
            setOpponentName("")
            setNotifyMessage("Challenge has been sent")
            setNotifyAlertOpen(true)
            console.log("Challenge has been sent")
        }
        else{
            console.log("socket not initialized");
        }
    }
    const goBack = ()=>{
        socket.emit('go-back',{roomId})
        setRoomId(-1);
        setBoard([])
        setMySign("")
        setOpponentName("")
        setChatbox([])
        setInGame(false)
    }
    const sendRematchChallenge =()=>{
        socket.emit('rematch-challenge',{
            roomId,
        })
        setNotifyMessage("rematch challenge has been sent")
        setNotifyAlertOpen(true)
        console.log("rematch challenge has been sent")
    }
    
    const handleAcceptChallenge = () =>{
        if(!rematchChallenge)socket.emit('challenge-responce',{  accept:true ,challengerName })
        else socket.emit('rematch-challenge-responce',{  accept:true ,roomId })
        setRematchChallenge(false)
        setChallengeAlertOpen(false)
    }
    const handleDeclineChallenge = () =>{
        if(!rematchChallenge)socket.emit('challenge-responce',{  accept:false ,challengerName })
        else socket.emit('rematch-challenge-responce',{  accept:false ,roomId })
        setRoomId(-1);
        setBoard([])
        setMySign("")
        setOpponentName("")
        setChatbox([])
        setInGame(false)
        setRematchChallenge(false)
        setChallengeAlertOpen(false)
    }
    const sendMessage =()=>{
        if(newMessage.data!="")socket.emit('message',{
            message:newMessage,
            sender:userName
        })
        setNewMessage({roomId:-1,data:"",senderName:""})
    }
    const onMove =(index:number)=>{
        if(currPlayer!=mySign || board[index]!=null || winner!==null) return;
        socket.emit('move',{
            roomId,
            sign:mySign,
            index,
        })
    }
    useEffect(() => {
        if(socket)
        {
            socket.on('challenge-responce',(challenge)=>{
                setNotifyMessage(challenge.message)
                setNotifyAlertOpen(true)
            })
            socket.on('rematch-challenge-responce',(challenge)=>{
                if(challenge.success)
                {
                    setNotifyMessage(challenge.message)
                    setNotifyAlertOpen(true)
                }
                else
                {
                    setNotifyMessage(challenge.message)
                    setNotifyAlertOpen(true)
                    setRoomId(-1);
                    setBoard([])
                    setMySign("")
                    setOpponentName("")
                    setChatbox([])
                    setInGame(false)
                }
            })
            socket.on('challenge',({challengerName})=>{
                setChallengerName(challengerName)
                setRematchChallenge(false)
                setChallengeAlertOpen(true)
            })
            socket.on('join-room',(roomData)=>{
                const mySign = (userName === roomData.user1) ? 'X' : 'O';
                const opponentName = (userName === roomData.user1) ? roomData.user2 : roomData.user1;
                setRoomId(roomData.roomId);
                setWinner(roomData.winner)
                setBoard(roomData.board)
                setMySign(mySign)
                setOpponentName(opponentName)
                setChatbox(roomData.chatbox)
                setCurrPlayer(roomData.currPlayer)
                setInGame(true)
            })
            socket.on('update-chatbox',({chatbox})=>{
                setChatbox(chatbox);
            })
            socket.on('peer-disconnected',({message})=>{
                setNotifyMessage(message)
                setNotifyAlertOpen(true)
                setRoomId(-1);
                setBoard([])
                setMySign("")
                setOpponentName("")
                setChatbox([])
                setInGame(false)
            })
            socket.on('update-board',(game)=>{
                setBoard(game.board)
                setCurrPlayer(game.currPlayer)
                setWinner(game.winner)
            })
            socket.on('rematch-challenge',()=>{
                setChallengerName(challengerName)
                setRematchChallenge(true)
                setChallengeAlertOpen(true)
            })
        }
      }, []);
  
    if(!inGame)
    return (
        <div className="set_challenge_screen">
            <ChallengeAlert
                open={challengeAlertOpen}
                challenger={challengerName}
                onClose={handleDeclineChallenge}
                onAccept={handleAcceptChallenge}
                rematchChallenge={rematchChallenge}
                onDecline={handleDeclineChallenge}
            />
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-sm-12 mt-2 text-center">
                        <img src="tictactoe.jpg"></img>
                        <div className="mt-5 mb-3">
                            <h2>Challenge your friend to play tic tac toe.</h2>
                            <div className="d-inline-flex mt-5">
                                <input value={opponentName} type="text" className="form-control" placeholder="Name" onChange={(e) => {
                                    setOpponentName(e.target.value)
                                }} />
                                <button type="button" className="btn" onClick={() => {
                                    if(opponentName!="")sendChallenge(opponentName)
                                }}>
                                    Challenge
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    return(
        <div className="in_game_screen">
            <ChallengeAlert
                open={challengeAlertOpen}
                challenger={challengerName}
                onClose={handleDeclineChallenge}
                onAccept={handleAcceptChallenge}
                rematchChallenge={rematchChallenge}
                onDecline={handleDeclineChallenge}
            />
            
            <div className="container d-flex align-items-center justify-content-center">
                <div className="row mt-5 mb-3">
                    <div className="col-lg-6 col-sm-12 mt-2 row text-center">
                        <h3>{userName} vs {opponentName}</h3>
                        <h6>Your sign : {mySign}</h6>
                        <Board onMove={onMove} board={board}></Board> 
                        
                        {winner==='D' && <p>Game is a draw</p>}
                        {(winner==='X' || winner=='O') && <p>{winner===mySign ? userName : opponentName} won</p>}
                        {winner!==null && 
                            <div>
                                <button className="btn" onClick={() => goBack()}>
                                    Go back
                                </button>
                                <button className="btn" onClick={() => sendRematchChallenge()}>
                                    Rematch
                                </button>
                            </div>
                        }
                    </div>
                    <div className="col-lg-6 col-sm-12 mt-2 text-center">
                        
                        <div className="card">
                            <div className="card-body">
                                <div className="chatbox mt-3">
                                    <ChatBox chatbox={chatbox} />
                                </div>
                                <div className="input-group mt-3">
                                    <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type your message..."
                                    value={newMessage.data}
                                    onChange={(e) => {
                                        setNewMessage({
                                        roomId,
                                        data: e.target.value,
                                        senderName: userName,
                                        });
                                    }}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn" onClick={() => sendMessage()}>
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default Room