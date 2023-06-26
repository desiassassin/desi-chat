import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { RiMoreFill, RiEdit2Fill } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import styled from "styled-components";
import SidebarChat from "./SidebarChat";
import store from "../../../redux/store";
import * as ACTIONS from "../../../redux/actions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { StatusCodes } from "http-status-codes";
import { useEffect, useRef } from "react";
import { useDrag } from "@use-gesture/react";

const LeftSidebar = () => {
     const navigate = useNavigate();
     const user = useSelector((state) => state.user);
     const wrapperRef = useRef(null);
     const navigateToHome = (e) => {
          navigate("/me");
     };
     const handleLogout = async () => {
          try {
               const response = await Axios({ method: "GET", url: `${import.meta.env.VITE_APP_BASE_URL}/logout` });
               if (response.status === StatusCodes.OK) {
                    navigate("/login", { replace: true });
                    store.dispatch({ type: ACTIONS.USER.LOGGED_OUT });
               }
          } catch (error) {
               console.log(error.message);
          }
     };
     const openConversation = (event) => {
          const { username } = event.currentTarget.dataset;
          navigate(`/me/${username}`);
     };

     const expandButtonSwipeAndDragHandler = useDrag(
          ({ movement: [mx] }) => {
               if (mx >= wrapperRef.current.offsetWidth) return;
               wrapperRef.current.style.translate = `${mx - wrapperRef.current.offsetWidth}px 0`;
          },
          {
               axis: "x"
          }
     );

     const sidebarWrapperSwipeAndDragHandler = useDrag(
          ({ movement: [mx] }) => {
               // hide the siderbar when user slider the wrapper by half the width
               if (mx <= -wrapperRef.current.offsetWidth / 2)
                    wrapperRef.current.style.translate = `${(wrapperRef.current.offsetWidth + 16) * -1}px 0`;
               else if (mx < 0) wrapperRef.current.style.translate = `${mx}px 0`;
          },
          {
               axis: "x"
          }
     );

     // useEffect(() => {
     //      window.addEventListener("resize", (event) => {
     //           if(window.innerWidth > 900) {
     //                wrapperRef.current.removeAttribute("style");
     //           }
     //      })

     //      return () => {
     //           window.onresize = null;
     //      }

     // }, [])

     return (
          <>
               <Wrapper ref={wrapperRef} {...sidebarWrapperSwipeAndDragHandler()}>
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
                    {user.conversations?.map((conversation) => {
                         return <SidebarChat key={conversation._id} conversation={conversation} openConversation={openConversation} />;
                    })}
                    <Filler />
               </Wrapper>
               <ExpandButton {...expandButtonSwipeAndDragHandler()} />
          </>
     );
};

export default LeftSidebar;

const ExpandButton = styled.div`
     position: fixed;
     height: 200px;
     width: 5px;
     z-index: 1;
     left: 0;
     border-radius: 0px 100px 100px 0px;
     background-color: grey;
     align-items: center;
     cursor: pointer;
     touch-action: none;
`;

const Wrapper = styled.div`
     flex: 1;
     min-width: 250px;
     max-width: 500px;
     height: calc(100vh - var(--spacing) * 2);
     border-radius: var(--border-radius);
     backdrop-filter: blur(5px);
     overflow-y: auto;
     outline: 1px solid rgb(var(--bg-light));
     display: flex;
     flex-direction: column;
     border: 1px solid rgb(var(--bg-dark));
     touch-action: none;

     @media (max-width: 900px) {
          position: absolute;
          z-index: 1;
          left: 1rem;
          translate: calc(-100% - 1rem) 0;
     }

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

     @media (max-width: 900px) {
          background-color: rgb(var(--bg-light), 1);
     }

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
     flex-grow: 1;
`;
