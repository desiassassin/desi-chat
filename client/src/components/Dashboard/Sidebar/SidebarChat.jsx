import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";

const SidebarChat = () => {
     return (
          <Slakdjald className="sidebar-chat">
               <div className="profile-container">
                    <div className="photo">
                         <FaUserCircle size="40px" />
                    </div>
                    <div className="details">
                         <div className="username-time">
                              <div className="username">Ajay Devgan</div>
                              <div className="time">03:00 PM</div>
                         </div>
                         <div className="last-message-unread">
                              <div className="last-message">Bhai gaadi dega?</div>
                              <div className="unread">1</div>
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
          background-color: rgb(var(--bg-light));

          * {
               pointer-events: none;
          }

          &.active,
          :hover {
               background-color: rgb(var(--bg-light), 0);
          }

          .profile-container {
               display: flex;
               gap: calc(var(--spacing) / 4 * 3);

               .photo {
                    display: flex;
                    align-items: center;
                    svg {
                         fill: rgb(var(--accent-primary));
                    }
               }

               .details {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    overflow: hidden;
                    width: 100%;

                    .username-time {
                         display: flex;
                         justify-content: space-between;
                         align-items: center;
                         gap: calc(var(--spacing) / 2);

                         .username {
                              color: rgb(var(--font-bright));
                              font-weight: 700;
                              text-overflow: ellipsis;
                              white-space: nowrap;
                              overflow: hidden;
                         }

                         .time {
                              color: rgb(var(--font-dark));
                              font-size: var(--font-xs);
                         }
                    }

                    .last-message-unread {
                         display: flex;
                         justify-content: space-between;
                         align-items: center;
                         gap: calc(var(--spacing) / 4);

                         .last-message {
                              color: rgb(var(--font-dark));
                              text-overflow: ellipsis;
                              white-space: nowrap;
                              overflow: hidden;
                         }

                         .unread {
                              background-color: rgb(var(--accent-error));
                              border-radius: 1em;
                              padding: 0px calc(var(--spacing) / 3);
                              /* padding: 0px 7px; */
                              font-weight: 700;
                              font-size: var(--font-small);
                         }
                    }
               }
          }
     }
`;
