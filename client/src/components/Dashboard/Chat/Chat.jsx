import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TopBar from "./TopBar";

const Chat = () => {
     const { username } = useParams();
     const { status } = useSelector((state) => state.user.friends).find((friend) => friend.username === username);
     return (
          <>
               <TopBar username={username} status={status} />
          </>
     );
};

export default Chat;
