import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";

const SidebarChat = () => {
     return (
          <Slakdjald className="sidebar-chat">
               <div className="profile-container">
                    <div className="photo">
                         <FaUserCircle size="50px" />
                    </div>
                    <div className="details">
                         <div className="username-time">
                              <div className="username">Sharry Mann</div>
                              <div className="time">03:00pm</div>
                         </div>
                         <div className="last-message-unread">
                              <div className="last-message">Chal aa gaya fer..!! na bhia me to ni aara. me kyu aau isme mera kya fayeda mujhe kya mil ra</div>
                              <div className="unread">
                                   <div className="amount">2</div>
                              </div>
                         </div>
                    </div>
               </div>
          </Slakdjald>
     );
};

export default SidebarChat;

const Slakdjald = styled.div`
     &.sidebar-chat {
          padding: var(--spacing);
          cursor: pointer;

          :hover {
               background-color: rgb(var(--bg-light));
          }

          .profile-container {
               display: flex;
               gap: calc(var(--spacing));

               .photo svg {
                    fill: rgb(var(--accent-primary));
               }

               .details {
                    display: flex;
                    flex-direction: column;
                    gap: calc(var(--spacing) / 2);
                    overflow: hidden;

                    .username-time {
                         display: flex;
                         justify-content: space-between;

                         .username {
                              color: rgb(var(--font-bright));
                              font-weight: 700;
                         }

                         .time {
                              color: rgb(var(--font-dark));
                              font-size: var(--font-small);
                         }
                    }

                    .last-message-unread {
                         display: flex;
                         justify-content: space-between;
                         align-items: center;

                         .last-message {
                              color: rgb(var(--font-dark));
                              text-overflow: ellipsis;
                              white-space: nowrap;
                              overflow: hidden;
                         }

                         .unread {
                              background-color: rgb(var(--accent-primary));
                              border-radius: 50%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              font-size: var(--font-small);

                              .amount {
                                   text-align: center;
                                   width: 15px;
                                   height: 15px;
                              }
                         }
                    }
               }
          }
     }
`;
