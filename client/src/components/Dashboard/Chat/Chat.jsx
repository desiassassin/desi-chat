import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SendMessage from "./SendMessage";
import TopBar from "./TopBar";
import Messages from "./Messages";

const Chat = () => {
     const { username } = useParams();
     const friend = useSelector((state) => state.user.friends).find((friend) => friend.username === username);
     const conversation = useSelector((state) => state.user.conversations).find((conversation) => conversation.participants.find((participant) => participant.username === username));
     return (
          <ChatWrapper>
               {!friend && <Navigate to="/me" replace={true} />}
               <TopBar username={username} status={friend?.status} />
               <Messages conversation={conversation} />
               <SendMessage friend={friend} conversation={conversation} />
          </ChatWrapper>
     );
};

export default Chat;

const ChatWrapper = styled.div`
     display: flex;
     flex-direction: column;
     height: 100%;
`;
