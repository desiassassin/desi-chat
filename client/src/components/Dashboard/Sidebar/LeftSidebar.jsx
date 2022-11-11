import { FaUserCircle } from "react-icons/fa";
import { RiMoreFill, RiEdit2Fill } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import styled from "styled-components";
import SidebarChat from "./SidebarChat";
import store from "../../../redux/store";
import { useSelector } from "react-redux";
import cookies from "../../../lib/universalCookies";
import { useNavigate } from "react-router-dom";

const LeftSidebar = () => {
     const navigate = useNavigate();
     const { username, bio } = useSelector((state) => state.user);
     const handleLogout = (e) => {
          cookies.remove("accessToken", { path: "/" });
          navigate("/login");
     };
     return (
          <Wrapper>
               <Profile className="">
                    <div className="profile-container">
                         <div className="photo">
                              <FaUserCircle size="40px" />
                         </div>
                         <div className="details">
                              <div className="username">{username}</div>
                              <div className="bio">{bio || "Bio"}</div>
                         </div>
                    </div>
                    <div className="more-options" tabIndex={0}>
                         <RiMoreFill className="" />
                         <div className="options">
                              <div className="option edit" tabIndex={0}>
                                   Edit <RiEdit2Fill />
                              </div>
                              <div className="option logout" onClick={handleLogout} tabIndex={0}>
                                   Logout <MdLogout />
                              </div>
                         </div>
                    </div>
               </Profile>
               <div className="recent-chats ">
                    <div className="search">
                         <input type="search" placeholder="Search conversations" spellCheck="false" />
                         <IoIosSearch size="18px" />
                    </div>
                    Recent Chats
               </div>
               {/* <SidebarChat />
               <SidebarChat />
               <SidebarChat /> */}
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
          position: relative;

          .options {
               display: none;
               position: absolute;
               right: 0;
               top: var(--spacing);
               top: 0;
               z-index: 1;
               background-color: black;
               border-radius: var(--border-radius);

               .option {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing);
                    padding: calc(var(--spacing) / 2) var(--spacing);
                    font-weight: 700;
                    color: rgb(var(--font-bright));

                    svg {
                         fill: rgb(var(--font-bright));
                    }

                    &.logout,
                    &.logout > svg {
                         color: rgb(var(--accent-error));
                         fill: rgb(var(--accent-error));
                    }
               }
          }

          :hover,
          :focus-within {
               .options {
                    display: block;
               }
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
