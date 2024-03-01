import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Room from "./Room";
import { socket } from "./Socket";
import NotifyAlert from "./NotifyAlert";


const Root = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [notifyMessage,setNotifyMessage] = useState("")
  const [notifyAlertOpen, setNotifyAlertOpen] = useState(false);
  const closeNotifyAlert = () =>{
    setNotifyMessage("")
    setNotifyAlertOpen(false)
  }
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.on('challenge',({challengerName})=>{
        console.log(`you have been challenged by ${challengerName}`)
      })
      socket.on('connection-responce',(connection)=>{
        if(connection.success)
        {
          setJoined(true)
        }
        else{
          setNotifyMessage(connection.message)
          setNotifyAlertOpen(true)
          console.log(connection.message)  
        }
      })
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
 if(!isConnected)
  return(
    <div className="d-flex align-items-center justify-content-center">
      <h1>Loading...</h1>
    </div>
    )


  if (!joined)
    return (
      <div className="initial_screen">
        <NotifyAlert
                setNotifyAlertOpen={setNotifyAlertOpen}
                message={notifyMessage}
                open={notifyAlertOpen}
                onClose={closeNotifyAlert}
        ></NotifyAlert>
        <Navbar userName={userName} connected={joined}></Navbar>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12 mt-1 text-center">
              <img src="tictactoe.jpg"></img>
              <div className="mt-5">
                <h2>Join the party to play tic tac toe online with your friends.</h2>
                <div className="d-inline-flex mt-5">
                  <input type="text" className="form-control" placeholder="Name" onChange={(e) => {
                    setUserName(e.target.value)
                  }} />
                  <button type="button" className="btn" onClick={() => {
                    if (userName != "") {
                      socket?.emit('connect-user', { name: userName })
                    }
                  }}>
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <NotifyAlert
                setNotifyAlertOpen={setNotifyAlertOpen}
                message={notifyMessage}
                open={notifyAlertOpen}
                onClose={closeNotifyAlert}
      ></NotifyAlert>
      <Navbar userName={userName} connected={joined}></Navbar>
      <Room
        setNotifyAlertOpen={setNotifyAlertOpen}
        notifyMessage={notifyMessage}
        setNotifyMessage={setNotifyMessage}
        socket={socket}
        userName={userName}
      ></Room>
    </div>
  )
}

export default Root;
