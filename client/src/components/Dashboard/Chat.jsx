import { useParams } from "react-router-dom";

const Chat = () => {
     const { username } = useParams();
     return <h1>{username}</h1>;
};

export default Chat;
