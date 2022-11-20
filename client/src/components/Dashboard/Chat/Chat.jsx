import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TopBar from "./TopBar";
import { useNavigate, Navigate } from "react-router-dom";

const Chat = () => {
     const navigate = useNavigate();
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
