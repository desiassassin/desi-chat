import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SendMessage from "./SendMessage";
import TopBar from "./TopBar";
import Messages from "./Messages";
import { useEffect } from "react";
import Axios from "axios";
import { fetchToken } from "../../../lib/universalCookies";
import store from "../../../redux/store";
import * as ACTIONS from "../../../redux/actions";
import { toast } from "react-toastify";

const Chat = () => {
     const { username } = useParams();
     const friend = useSelector((state) => state.user.friends).find((friend) => friend.username === username);
     const conversation = useSelector((state) => state.user.conversations).find((conversation) => conversation.participants.find((participant) => participant.username === username));
     const user = useSelector((state) => state.user);

     useEffect(() => {
          if (user.unread.hasOwnProperty(conversation?._id)) {
               (async function () {
                    const token = fetchToken("accessToken");

                    if (token) {
                         try {
                              const response = await Axios({
                                   baseURL: `${import.meta.env.VITE_APP_BASE_URL_API_V1}/conversation/${conversation._id}/unread`,
                                   method: "delete",
                                   headers: { authorization: `BEARER ${token}` },
                              });

                              if (response.data.message === "Removed unread messages.") {
                                   store.dispatch({ type: ACTIONS.FRIENDS.UNREAD_REMOVED, payload: { conversationId: response.data.conversationId } });
                              }
                         } catch (error) {
                              console.log(error.message);
                              toast.error(error.response.data.message);
                         }
                    }
               })();
          }
     }, []);
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
