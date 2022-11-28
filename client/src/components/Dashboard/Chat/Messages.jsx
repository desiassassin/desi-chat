import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { useEffect } from "react";
import Axios from "axios";
import { fetchToken } from "../../../lib/universalCookies";
import * as ACTIONS from "../../../redux/actions";
import store from "../../../redux/store";

const Messages = ({ conversation }) => {
     useEffect(() => {
          (async function () {
               const token = fetchToken("accessToken");

               if (!token) return;

               try {
                    const response = await Axios({
                         baseURL: `${process.env.REACT_APP_BASE_URL}/api/v1/conversation/${conversation._id}/messages`,
                         method: "GET",
                         headers: {
                              authorization: `BEARER ${token}`,
                         },
                         params: { limit: 50 },
                    });

                    if (response.status === 200 && response.data.messages.length > 0) {
                         store.dispatch({ type: ACTIONS.FRIENDS.PERSONAL_MESSAGES_LOADED, payload: { conversationId: conversation._id, messages: response.data.messages } });
                    }
               } catch (error) {
                    console.log(error.message);
               }
          })();
     }, []);

     return (
          <MessageWrapper id="messages">
               {conversation?.messages?.map?.((message) => (
                    <div key={message._id} className="message">
                         <div className="profile">
                              <FaUserCircle size="35px" />
                         </div>
                         <div className="sender-content">
                              <div className="sender-time">
                                   <div className="sender">{message.author.username}</div>
                                   <div className="time">{new Date(message.createdAt).toDateString()}</div>
                              </div>
                              <div className="content">{message.content}</div>
                         </div>
                    </div>
               ))}
          </MessageWrapper>
     );
};

export default Messages;

const MessageWrapper = styled.div`
     height: 100%;
     padding-inline: var(--spacing);
     overflow-y: scroll;

     .message {
          display: flex;
          gap: var(--spacing);
          padding-top: var(--spacing);

          .profile svg {
               fill: rgb(var(--accent-primary));
          }

          .sender-content {
               .sender-time {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing);
               }

               .sender {
                    font-weight: 700;
               }

               .time {
                    font-size: var(--font-xs);
                    color: rgb(var(--font-dark));
               }
               .content {
               }
          }
     }
`;
