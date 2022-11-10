import styled from "styled-components";
import { FaUserFriends } from "react-icons/fa";
import { useState } from "react";

const Home = () => {
     const [optionSelected, setOptionSelected] = useState("Online");
     const handleOptionChange = (e) => {
          const { innerText } = e.target;
          setOptionSelected(innerText);
     };
     const sendFriendRequest = (event) => {
          event.preventDefault();
          const username = document.getElementById("");
     };

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
                    <div className={`home-options ${optionSelected === "Pending" ? "selected" : ""}`} onClick={handleOptionChange}>
                         Pending
                    </div>
                    <div className={`home-options ${optionSelected === "Blocked" ? "selected" : ""}`} onClick={handleOptionChange}>
                         Blocked
                    </div>
                    <div className={`home-options add-friend ${optionSelected === "Add Friend" ? "selected" : ""}`} onClick={handleOptionChange}>
                         Add Friend
                    </div>
               </TopBar>
               {optionSelected === "Add Friend" && (
                    <AddFriend>
                         <form className="wrapper" onSubmit={sendFriendRequest}>
                              <input
                                   type="text"
                                   name="username"
                                   id=""
                                   className="add-friend"
                                   placeholder="Enter a username"
                                   autoFocus
                                   onChange={(e) => {
                                        const username = e.target.value;
                                        const button = document.getElementById("send-friend-request-button");
                                        button.disabled = username ? false : true;
                                   }}
                              />
                              <button id="send-friend-request-button" type="submit" disabled>
                                   Send Friend Request
                              </button>
                         </form>
                    </AddFriend>
               )}
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

          &.add-friend {
               background-color: rgb(var(--accent-secondary-dark));
               color: rgb(var(--font-bright));

               &.selected {
                    font-weight: 700;
                    background-color: transparent;
                    color: rgb(var(--accent-secondary-dark));
               }
          }
     }
`;

const AddFriend = styled.div`
     padding: var(--spacing);

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
