import { useEffect, useState } from "react";
import { BsCheckCircle, BsThreeDotsVertical, BsXCircle } from "react-icons/bs";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { MdPersonOff } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as ACTIONS from "../../redux/actions";
import store from "../../redux/store";
import { socket } from "./Dashboard";
import { IoIosCall, IoIosVideocam } from "react-icons/io";

const Home = () => {
     const user = useSelector((state) => state.user);
     const [optionSelected, setOptionSelected] = useState("Online");

     useEffect(() => {
          socket.on("friend-request-initiated-response", (message) => {
               const errorDiv = document.getElementById("friend-request-error");
               errorDiv.innerText = message;
          });

          socket.on("friend-request-sent", ({ _id, username }) => {
               toast.success("Friend request sent.");
               store.dispatch({ type: ACTIONS.FRIENDS.REQUEST_SENT, payload: { _id, username } });
          });

          socket.on("friend-request-initiated-response", (message) => toast.error(message));

          socket.on("friend-request-accept-success", ({ acceptedUser, _id }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.REQUEST_ACCEPTED_CURRENT_USER, payload: { acceptedUser, _id } });
          });

          return () => {
               socket.off("friend-request-initiated-response");
               socket.off("friend-request-sent");
               socket.off("friend-request-initiated-response");
               socket.off("friend-request-accept-success");
          };
     }, []);

     const handleOptionChange = (e) => {
          const { innerText } = e.target;
          setOptionSelected(innerText);
     };
     const sendFriendRequest = (event) => {
          event.preventDefault();
          const usernameToAdd = document.getElementById("friend-request-username").value;
          const errorDiv = document.getElementById("friend-request-error");
          let errorMessage = "";

          // validations;
          if (user.username === usernameToAdd) {
               errorMessage = "Ahh silly! You can't add yourself.";
          } else if (user.friends.length && user.friends.find((request) => request.username === usernameToAdd)) {
               errorMessage = `You and ${usernameToAdd} are already friends.`;
          } else if (user.friendRequestsSent.length && user.friendRequestsSent.find((request) => request.username === usernameToAdd)) {
               errorMessage = `A friend request to ${usernameToAdd} has already been sent.`;
          } else if (user.friendRequestsPending.length && user.friendRequestsPending.find((request) => request.username === usernameToAdd)) {
               errorMessage = `${usernameToAdd} has already sent you a friend request. Check your pending requests.`;
          } else if (user.blocked.length && user.blocked.find((user) => user.username === usernameToAdd)) {
               errorMessage = `You have blocked ${usernameToAdd}. Unblock them to send a friend request.`;
          }

          // errorDiv.innerText = errorMessage;
          !errorMessage && socket.emit("friend-request-initiated", { usernameToAdd, username: user.username });
     };
     const acceptFriendRequest = (event) => {
          const { username, _id } = event.currentTarget.dataset;
          socket.emit("friend-request-accept-initiated", { currentUser: user.username, acceptedUser: username, _id });
     };
     const rejectFriendRequest = (event) => {};
     const cancelFriendRequest = (event) => {};
     const openConversation = (event) => {};

     return (
          <>
               <TopBar>
                    <div className="header">
                         <FaUserFriends size="18px" />
                         Friends
                    </div>
                    <div className={`home-options ${optionSelected === "Online" ? "selected" : ""}`} onClick={handleOptionChange}>
                         Online
                    </div>
                    <div className={`home-options ${optionSelected === "All" ? "selected" : ""}`} onClick={handleOptionChange}>
                         All
                    </div>
                    <div className={`home-options pending ${optionSelected === "Pending" ? "selected" : ""}`} onClick={handleOptionChange}>
                         Pending
                         {!!user?.friendRequestsPending?.length && <span>{user.friendRequestsPending.length}</span>}
                    </div>
                    <div className={`home-options ${optionSelected === "Blocked" ? "selected" : ""}`} onClick={handleOptionChange}>
                         Blocked
                    </div>
                    <div className={`home-options add-friend ${optionSelected === "Add Friend" ? "selected" : ""}`} onClick={handleOptionChange}>
                         Add Friend
                    </div>
               </TopBar>

               {(() => {
                    switch (optionSelected) {
                         case "All":
                              return (
                                   <All>
                                        {user.friends.map(({ username, _id, status }) => (
                                             <div key={username} className="contact">
                                                  <div className="user">
                                                       <FaUserCircle className="profile" size="30px" />
                                                       <div>
                                                            <div className="username">{username}</div>
                                                            <div className="status">{status ? status : "Offline"}</div>
                                                       </div>
                                                  </div>
                                                  <div className="actions">
                                                       <div className="message">
                                                            <RiMessage2Fill title="Send Message" size="20px" onClick={openConversation} data-username={username} data-_id={_id} />
                                                       </div>
                                                       <div className="more-options">
                                                            <BsThreeDotsVertical title="Options" size="20px" data-username={username} data-_id={_id} />
                                                            <div className="options">
                                                                 <div className="option">
                                                                      <span>Voice Call</span>
                                                                      <IoIosCall />
                                                                 </div>
                                                                 <div className="option">
                                                                      <span>Video Call</span>
                                                                      <IoIosVideocam />
                                                                 </div>
                                                                 <div className="option remove-friend">
                                                                      <span>Unfriend</span>
                                                                      <MdPersonOff />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}
                                   </All>
                              );
                         case "Pending":
                              return (
                                   <Pending>
                                        {user.friendRequestsPending.map(({ username, _id }) => (
                                             <div key={username} className="request">
                                                  <div className="user">
                                                       <FaUserCircle className="profile" size="30px" />
                                                       <div>
                                                            <div className="username">{username}</div>
                                                            <div className="request-type">Incoming friend request</div>
                                                       </div>
                                                  </div>
                                                  <div className="actions">
                                                       <BsCheckCircle title="Accept" className="accept" size="25px" onClick={acceptFriendRequest} data-username={username} data-_id={_id} />
                                                       <BsXCircle title="Reject" className="reject" size="25px" onClick={rejectFriendRequest} data-username={username} data-_id={_id} />
                                                  </div>
                                             </div>
                                        ))}
                                        {user.friendRequestsSent.map(({ username, _id }) => (
                                             <div key={username} className="request">
                                                  <div className="user">
                                                       <FaUserCircle className="profile" size="30px" />
                                                       <div>
                                                            <div className="username">{username}</div>
                                                            <div className="request-type">Outgoing friend request</div>
                                                       </div>
                                                  </div>
                                                  <div className="actions">
                                                       <BsXCircle title="Cancel request" className="reject" size="25px" onClick={cancelFriendRequest} data-username={username} data-_id={_id} />
                                                  </div>
                                             </div>
                                        ))}
                                   </Pending>
                              );
                         case "Add Friend":
                              return (
                                   <AddFriend>
                                        <form className="wrapper" onSubmit={sendFriendRequest}>
                                             <input
                                                  type="text"
                                                  name="username"
                                                  id="friend-request-username"
                                                  className="add-friend"
                                                  placeholder="Enter a username"
                                                  autoFocus
                                                  onChange={(e) => {
                                                       const username = e.target.value.trim();
                                                       const button = document.getElementById("friend-request-button");
                                                       document.getElementById("friend-request-error").innerText = "";
                                                       button.disabled = username ? false : true;
                                                  }}
                                             />
                                             <button id="friend-request-button" type="submit" disabled>
                                                  Send Friend Request
                                             </button>
                                        </form>
                                        <div id="friend-request-error"></div>
                                   </AddFriend>
                              );
                         default:
                              return;
                    }
               })()}
          </>
     );
};

export default Home;

const TopBar = styled.div`
     display: flex;
     align-items: center;
     gap: var(--spacing);
     width: 100%;
     padding: var(--spacing);
     font-size: var(--font-big);
     border-bottom: 1px solid rgb(var(--bg-dark));

     .header {
          display: flex;
          align-items: center;
          gap: calc(var(--spacing) / 2);
          font-weight: 700;
     }

     .divider {
          width: 1px;
          height: var(--font-big);
          background-color: rgb(var(--font-dark));
     }

     .home-options {
          padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2);
          border-radius: calc(var(--border-radius) / 2);
          color: rgb(var(--font-dark));
          cursor: pointer;

          :hover,
          &.selected {
               background-color: rgb(var(--font-dark), 0.2);
               color: rgb(var(--font-bright));
          }

          &.pending {
               display: flex;
               align-items: center;
               gap: calc(var(--spacing) / 4);

               span {
                    background-color: rgb(var(--accent-error-dark));
                    color: rgb(var(--font-bright));
                    padding: 1px 4px;
                    border-radius: var(--border-radius);
                    font-size: var(--font-xs);
                    font-weight: 700;

                    :empty {
                         display: none;
                    }
               }
          }

          &.add-friend {
               background-color: rgb(var(--accent-secondary-dark));
               color: rgb(var(--font-bright));
               width: max-content;

               &.selected {
                    font-weight: 700;
                    background-color: transparent;
                    color: rgb(var(--accent-secondary-dark));
               }
          }
     }
`;

const All = styled.div`
     padding: var(--spacing);

     .contact {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing);
          border-bottom: 1px solid rgb(var(--font-dark), 0.5);

          &:hover {
               .actions {
                    .message,
                    .more-options {
                         background-color: rgb(var(--bg-dark));
                    }
               }
          }

          .user {
               display: flex;
               align-items: center;
               gap: var(--spacing);

               .profile {
                    fill: rgb(var(--accent-primary));
               }

               .status {
                    color: rgb(var(--font-dark));
                    font-size: var(--font-small);
               }
          }

          .actions {
               display: flex;
               align-items: center;
               gap: var(--spacing);

               .message,
               .more-options {
                    cursor: pointer;
                    padding: 5px;
                    background-color: rgb(var(--bg-dark), 0.5);
                    border-radius: 50%;
                    display: flex;
                    padding: calc(var(--spacing) / 2);

                    svg {
                         fill: rgb(var(--font-dark));
                    }

                    :hover svg {
                         fill: rgb(var(--font-bright));
                    }
               }

               .more-options {
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
                              color: rgb(var(--font-bright));
                              padding-inline: var(--spacing);
                              padding-block: calc(var(--spacing) / 2);
                              font-size: var(--font-small);

                              span {
                                   width: max-content;
                              }
                              svg {
                                   fill: rgb(var(--font-bright));
                                   scale: 1.5;
                              }

                              &.remove-friend {
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

                              :hover {
                                   background-color: rgb(var(--font-bright), 0.25);
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
          }
     }
`;

const Pending = styled.div`
     padding: var(--spacing);

     .request {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing);
          border-bottom: 1px solid rgb(var(--font-dark), 0.5);

          .user {
               display: flex;
               align-items: center;
               gap: var(--spacing);

               .profile {
                    fill: rgb(var(--accent-primary));
               }

               .request-type {
                    color: rgb(var(--font-dark));
                    font-size: var(--font-small);
               }
          }

          .actions {
               display: flex;
               align-items: center;
               gap: var(--spacing);

               .accept,
               .reject {
                    cursor: pointer;
                    fill: rgb(var(--font-dark));
               }

               .accept:hover {
                    fill: rgb(var(--accent-secondary-dark));
               }
               .reject:hover {
                    fill: rgb(var(--accent-error));
               }
          }
     }
`;

const AddFriend = styled.div`
     padding: var(--spacing);
     display: flex;
     flex-direction: column;
     gap: calc(var(--spacing) / 2);
     border-bottom: 1px solid rgb(var(--bg-dark));

     #friend-request-error {
          color: rgb(var(--accent-error));
          padding-inline: var(--spacing);

          :empty {
               display: none;
          }
     }

     .wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          background-color: rgb(var(--bg-dark));
          border-radius: calc(var(--border-radius) / 1);

          padding: var(--spacing);

          input {
               width: 100%;
               height: 100%;
               border: none;
               outline: none;
               background-color: rgb(var(--bg-light));
               color: rgb(var(--font-bright));
               padding: calc(var(--spacing) / 2) calc(var(--spacing) / 1);
               padding-left: 0;
               background-color: transparent;
               font-size: var(--font-big);
          }

          button {
               border: none;
               outline: none;
               border-radius: calc(var(--border-radius) / 2);
               padding: calc(var(--spacing) / 2) calc(var(--spacing) / 2);
               width: 200px;
               font-weight: 700;
               color: white;
               cursor: pointer;
               background-color: rgb(var(--accent-primary));
               transition: opacity var(--transition-time);

               :disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
               }
          }
     }
`;
