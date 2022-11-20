import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import SendMessage from "./SendMessage";
import TopBar from "./TopBar";

const Chat = () => {
     const { username } = useParams();
     const isFriend = useSelector((state) => state.user.friends).find((friend) => friend.username === username);
     const friend = useSelector((state) => state.user.friends).find((friend) => friend.username === username);
     return (
          <>
               {!isFriend && <Navigate to="/me" replace={true} />}
               <TopBar username={username} status={friend?.status} />
               <SendMessage friend={friend} />
          </>
     );
};

export default Chat;
