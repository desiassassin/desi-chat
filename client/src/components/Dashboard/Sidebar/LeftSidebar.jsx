import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { RiMoreFill, RiEdit2Fill } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import styled from "styled-components";
import SidebarChat from "./SidebarChat";
import store from "../../../redux/store";
import * as ACTIONS from "../../../redux/actions";
import { useSelector } from "react-redux";
import cookies from "../../../lib/universalCookies";
import { useNavigate } from "react-router-dom";

const LeftSidebar = () => {
     const navigate = useNavigate();
     const user = useSelector((state) => state.user);
     const navigateToHome = (e) => {
          navigate("/me");
     };
     const handleLogout = (e) => {
          cookies.remove("accessToken", { path: "/" });
          store.dispatch({ type: ACTIONS.USER.LOGGED_OUT });
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
                              <div className="username">{user.username}</div>
                              <div className="bio">{user.bio || "Bio"}</div>
                         </div>
                    </div>
                    <div className="more-options" tabIndex={0}>
                         <RiMoreFill className="" />
                         <div className="options">
                              <div className="option" onClick={navigateToHome} tabIndex={0}>
                                   <span>Home</span>
                                   <FaUserFriends />
                              </div>
                              <div className="option edit" tabIndex={0}>
                                   <span>Edit</span>
                                   <RiEdit2Fill />
                              </div>
                              <div className="option logout" onClick={handleLogout} tabIndex={0}>
                                   <span>Logout</span>
                                   <MdLogout />
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
               {user.conversations.map((conversation) => {
                    return <SidebarChat key={conversation._id} conversation={conversation} />;
               })}
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
               top: 0;
               z-index: 1;
               background-color: black;
               border-radius: var(--border-radius);
               overflow: hidden;
               padding: 0;

               .option {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing);
                    font-weight: 700;
                    color: rgb(var(--font-bright));
                    padding-inline: var(--spacing);
                    padding-block: calc(var(--spacing) / 2);

                    span {
                         width: max-content;
                    }
                    svg {
                         fill: rgb(var(--font-bright));
                         scale: 1.5;
                    }

                    &.logout {
                         color: rgb(var(--accent-error));

                         svg {
                              fill: rgb(var(--accent-error));
                         }

                         :hover {
                              color: rgb(var(--font-bright));
                              background-color: rgb(var(--accent-error));
                              svg {
                                   fill: rgb(var(--font-bright));
                              }
                         }
                    }

                    :hover,
                    :focus {
                         outline: none;
                         background-color: rgb(var(--font-bright), 0.25);
                    }
               }
          }

          :hover,
          :focus-within {
               .options {
                    /* display: block; */
                    display: flex;
                    flex-direction: column;
                    gap: calc(var(--spacing) / 2);
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
`;

const Filler = styled.div`
     background-color: rgb(var(--bg-light));
     height: 100%;
`;
