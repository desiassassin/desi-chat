import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";

const Messages = ({ conversation }) => {
     return (
          <MessageWrapper id="messages">
               {conversation?.messages?.map?.((message) => (
                    <div key={message._id} className="message">
                         <div className="profile">
                              <FaUserCircle size="35px" />
                         </div>
                         <div className="sender-content">
                              <div className="sender">{message.author.username}</div>
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

     .message {
          display: flex;
          gap: var(--spacing);
          padding-top: var(--spacing);

          .profile svg {
               fill: rgb(var(--accent-primary));
          }

          .sender-content {
               .sender {
                    font-weight: 700;
               }
               .content {
               }
          }
     }
`;
