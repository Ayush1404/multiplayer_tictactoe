import { Message } from './Room'

const ChatBox = ({
    chatbox
}:{
    chatbox:Message[]
}) => {
  return (
    <div>
        {chatbox.map((message , index )=>(
            <div key={index}>
                {message.senderName}  :  {message.data}
            </div>
        ))}
    </div>
  )
}

export default ChatBox