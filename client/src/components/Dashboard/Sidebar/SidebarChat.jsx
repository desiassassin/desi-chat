import { useSelector } from "react-redux";
import styled from "styled-components";
import { PfpStatus } from "../Misc";

const SidebarChat = ({ conversation, openConversation }) => {
     const { participants, isGroup, groupName } = conversation;
     const user = useSelector((state) => state.user);
     const chatTitle = isGroup ? groupName : figureOutChatsTitle(participants);
     const lastMessage = conversation?.lastMessage ? conversation.lastMessage : "You are now connected.";
     const unreadCount = user.unread?.[conversation._id];
     const friend = user.friends.find((friend) => friend.username === chatTitle);

     function figureOutChatsTitle(participants) {
          return participants.filter((participant) => participant.username !== user.username)[0].username;
     }

     return (
          <Slakdjald className="sidebar-chat" onClick={openConversation} data-username={chatTitle}>
               <div className="profile-container">
                    <PfpStatus size="40px" bgc="rgb(var(--bg-light))" status={friend?.status} />
                    <div className="details">
                         <div className="username-time">
                              <div className="username">{chatTitle}</div>
                              <div className="time"></div>
                         </div>
                         <div className="last-message-unread">
                              <div className="last-message">{lastMessage}</div>
                              <div className="unread">{unreadCount}</div>
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
                              font-weight: 700;
                              font-size: var(--font-small);

                              :empty {
                                   display: none;
                              }
                         }
                    }
               }
          }
     }
`;
