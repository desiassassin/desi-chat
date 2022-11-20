import { FaUserCircle } from "react-icons/fa";
import { IoIosCall, IoIosVideocam } from "react-icons/io";
import { MdPersonOff } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import { BsCheckCircle, BsThreeDotsVertical, BsXCircle } from "react-icons/bs";
import styled from "styled-components";

export const FriendCard = ({ username, _id, status, openConversation, removeFriend }) => {
     return (
          <div key={username} className="contact" data-username={username} data-_id={_id}>
               <div className="user">
                    <PfpStatus size="30px" status={status} bgc="rgb(var(--bg-light))" />
                    <div>
                         <div className="username">{username}</div>
                         <div className="status">{status}</div>
                    </div>
               </div>
               <div className="actions">
                    <div className="message" onClick={openConversation} data-username={username} data-_id={_id}>
                         <RiMessage2Fill title="Send Message" size="20px" />
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
                              <div className="option remove-friend" onClick={removeFriend} data-username={username} data-_id={_id}>
                                   <span>Unfriend</span>
                                   <MdPersonOff />
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export const RequestCard = ({ username, _id, type, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest }) => {
     return (
          <div key={username} className="request">
               <div className="user">
                    <FaUserCircle className="profile" size="30px" />
                    <div>
                         <div className="username">{username}</div>
                         <div className="request-type">{`${type === "incoming" ? "Incoming" : "Outgoing"} friend request`}</div>
                    </div>
               </div>
               <div className="actions">
                    {type === "incoming" ? (
                         <>
                              <BsCheckCircle title="Accept" className="accept" size="25px" onClick={acceptFriendRequest} data-username={username} data-_id={_id} />
                              <BsXCircle title="Reject" className="reject" size="25px" onClick={rejectFriendRequest} data-username={username} data-_id={_id} />
                         </>
                    ) : (
                         <BsXCircle title="Cancel request" className="reject" size="25px" onClick={cancelFriendRequest} data-username={username} data-_id={_id} />
                    )}
               </div>
          </div>
     );
};

export const PfpStatus = ({ status, size, bgc }) => {
     return (
          <Pfpstatus className="pfp-status">
               <FaUserCircle className="pfp" size={size} fill="rgb(var(--accent-primary))" />
               <div className={`status ${status === "Online" ? "online" : "offline"}`} style={{ boxShadow: `0 0 0 3px ${bgc}` }}></div>
          </Pfpstatus>
     );
};

const Pfpstatus = styled.div`
     &.pfp-status {
          position: relative;
          display: flex;

          .status {
               position: absolute;
               right: 0;
               bottom: 0;
               border-radius: 50%;
               aspect-ratio: 1/1;
               height: 10px;
               box-shadow: 0 0 0 3px rgb(var(--bg-dark));

               &.online {
                    background-color: rgb(var(--accent-secondary));
               }
               &.offline {
                    background-color: gray;
               }
          }
     }
`;
