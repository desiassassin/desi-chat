import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import { BiInfoCircle } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";

const TopBar = ({ username, status }) => {
     return (
          <TopBarWrapper>
               <div>
                    <IoArrowBack className="back" />
                    <div className="user">
                         <div className="name">{username}</div>
                         <div className={`status ${status === "Online" ? "online" : "offline"}`}>
                              <GoPrimitiveDot />
                         </div>
                    </div>
               </div>
               <BiInfoCircle className="info" />
          </TopBarWrapper>
     );
};

export default TopBar;

const TopBarWrapper = styled.div`
     padding: var(--spacing);
     background-color: black;
     display: flex;
     justify-content: space-between;

     svg {
          scale: 1.5;
     }

     .user {
          .name {
               font-weight: 700;
          }
          .status {
               &.online svg {
                    fill: rgb(var(--accent-secondary-dark));
               }
               &.offline svg {
                    fill: gray;
               }
          }
     }
`;
