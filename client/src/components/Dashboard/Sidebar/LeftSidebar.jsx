import { FaUserCircle } from "react-icons/fa";
import { RiMoreFill } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
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
                              <div className="username">desiassassin</div>
                              <div className="bio">Founder, Desi Chat</div>
                         </div>
                    </div>
                    <RiMoreFill className="more-options" />
                    {/* <div className="options"></div> */}
               </Profile>
               <div className="recent-chats ">
                    <div className="search">
                         <input type="search" placeholder="Search conversations" spellCheck="false" />
                         <IoIosSearch size="18px" />
                    </div>
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
     outline: 1px solid rgb(var(--bg-light));

     .recent-chats {
          display: flex;
          flex-direction: column;
          gap: var(--spacing);
          font-weight: 700;
          padding-block: calc(var(--spacing) / 2);
          background-color: rgb(var(--bg-light));
          padding: var(--spacing);

          .search {
               position: relative;
               input {
                    width: 100%;
                    background-color: transparent;
                    outline: 1px solid rgb(255, 255, 255, 0.5);
                    border: none;
                    color: rgb(var(--font-bright));
                    /* font-weight: 700; */
                    font-size: 1rem;
                    padding: calc(var(--spacing));
                    padding-left: 35px;
                    border-radius: var(--border-radius);

                    &::-webkit-search-cancel-button {
                         scale: 1.25;
                         cursor: pointer;
                    }

                    :focus,
                    :hover {
                         outline: 2px solid rgb(255, 255, 255, 0.5);
                    }
               }

               svg {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    translate: 0 -50%;
                    fill: rgb(var(--font-dark));
               }
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
