import { useEffect } from "react";
import { fetchToken } from "../../lib/universalCookies";

const Chat = () => {
     useEffect(() => {
          fetchToken("accessToken");
     });
     return <h1>CHAT</h1>;
};

export default Chat;
