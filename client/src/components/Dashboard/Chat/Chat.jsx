import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import TopBar from "./TopBar";

const Chat = () => {
     const { username } = useParams();
     const isFriend = useSelector((state) => state.user.friends).find((friend) => friend.username === username);
     const status = useSelector((state) => state.user.friends).find((friend) => friend.username === username)?.status;
     return (
          <>
               {!isFriend && <Navigate to="/me" replace={true} />}
               <TopBar username={username} status={status} />
          </>
     );
};

export default Chat;
