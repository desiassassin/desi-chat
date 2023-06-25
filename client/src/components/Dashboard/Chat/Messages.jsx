import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { useEffect } from "react";
import Axios from "axios";
import * as ACTIONS from "../../../redux/actions";
import store from "../../../redux/store";
import { useSelector } from "react-redux";

const Messages = ({ conversation }) => {
     const user = useSelector((state) => state.user);
     useEffect(() => {
          (async function () {
               try {
                    const response = await Axios({
                         baseURL: `${import.meta.env.VITE_APP_BASE_URL}/api/v1/conversation/${conversation._id}/messages`,
                         method: "GET",
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

     useEffect(() => {
          const messagesContainer = document.getElementById("messages");
          messagesContainer.scrollTo({top: messagesContainer.scrollHeight});
     }, [user])

     return (
          <MessageWrapper id="messages">
               {conversation?.messages?.map?.((message) => (
                    <div key={message._id} className={`message ${message.author.username === user.username ? "self" : ""}`}>
                         <div className="profile">
                              <FaUserCircle size="35px" />
                         </div>
                         <div className="sender-content">
                              <div className="sender-time">
                                   <div className="sender">{message.author.username}</div>
                                   <div className="time">{`${message.createdAt.split("T")[0].split("-").reverse().join("-")} | ${new Date(message.createdAt).toLocaleTimeString()}`}</div>
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
     display: flex;
     flex-direction: column;

     .message {
          display: flex;
          gap: var(--spacing);
          padding-top: var(--spacing);
          /* max-width: 70%; */

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
     /* .message.self {
          align-self: flex-end;

          display: flex;
          flex-direction: row-reverse;
          gap: var(--spacing);
          padding-top: var(--spacing);
          max-width: 70%;

          .profile svg {
               fill: rgb(var(--accent-primary));
          }

          .sender-content {
               .sender-time {
                    display: flex;
                    flex-direction: row-reverse;
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
     } */
`;
