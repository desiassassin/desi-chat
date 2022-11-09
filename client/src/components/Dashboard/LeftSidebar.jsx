import { FaUserCircle } from "react-icons/fa";
import { RiMoreFill } from "react-icons/ri";
import styled from "styled-components";
import SidebarChat from "./SidebarChat";

const LeftSidebar = () => {
     return (
          <Wrapper>
               <Profile className="">
                    <div className="profile-container">
                         <div className="photo">
                              <FaUserCircle size="40px" />
                         </div>
                         <div className="details">
                              <div className="username">Arun Sehrawat</div>
                              <div className="bio">Founder, Desi Chat</div>
                         </div>
                    </div>
                    <RiMoreFill className="more-options" />
                    {/* <div className="options"></div> */}
               </Profile>
               <div className="recent-chats">
                    <input type="text" placeholder="Search conversations" />
                    {/* <div className="search-friends"></div> */}
                    Recent Chats
               </div>
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <Filler />
          </Wrapper>
     );
};

export default LeftSidebar;

const Wrapper = styled.div`
     flex: 1;
     min-width: 250px;
     max-width: 500px;
     height: calc(100vh - var(--spacing) * 2);
     border-radius: var(--border-radius);
     backdrop-filter: blur(5px);
     overflow-y: auto;
     display: flex;
     flex-direction: column;

     .recent-chats {
          display: flex;
          flex-direction: column;
          gap: var(--spacing);
          font-weight: 700;
          padding-block: calc(var(--spacing) / 2);
          background-color: rgb(var(--bg-light));
          padding: var(--spacing);

          input {
               background-color: transparent;
               outline: 1px solid rgb(255, 255, 255, 0.5);
               border: none;
               color: rgb(var(--font-bright));
               font-weight: 700;
               padding: var(--spacing);
               border-radius: var(--border-radius);
          }
     }
`;

const Profile = styled.div`
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding: var(--spacing);
     background-color: rgb(var(--bg-light), 0);

     border-bottom: 1px solid rgb(255, 255, 255, 0.5);

     .more-options {
          cursor: pointer;
          border-radius: 50%;

          :hover {
               background-color: rgb(var(--bg-light));
          }
     }

     .profile-container {
          display: flex;
          gap: calc(var(--spacing) / 2);

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
               gap: calc(var(--spacing) / 4);
               overflow: hidden;

               .username {
                    color: rgb(var(--font-bright));
                    font-weight: 700;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
               }

               .bio {
                    color: rgb(var(--font-dark));
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    font-size: var(--font-small);
               }
          }
     }

     .options {
          padding: calc(var(--spacing) / 4);
          svg {
               border-radius: 50%;
               cursor: pointer;
               scale: 1.5;
               fill: rgb(var(--font-dark));
               :hover {
                    background-color: rgb(var(--bg-light));
               }
          }
     }
`;

const Filler = styled.div`
     background-color: rgb(var(--bg-light));
     height: 100%;
`;
