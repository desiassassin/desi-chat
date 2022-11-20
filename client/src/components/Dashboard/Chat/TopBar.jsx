import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import { BiInfoCircle } from "react-icons/bi";
import { PfpStatus } from "../Misc";

const TopBar = ({ username, status = "Offline" }) => {
     return (
          <TopBarWrapper>
               <div className="user-wrapper">
                    <IoArrowBack className="back" size="30px" />
                    <div className="user">
                         <PfpStatus status={status} size="30px" />
                         <div className="name">{username}</div>
                    </div>
               </div>
               <BiInfoCircle className="info" size="30px" />
          </TopBarWrapper>
     );
};

export default TopBar;

const TopBarWrapper = styled.div`
     padding: var(--spacing);
     background-color: rgb(var(--bg-dark));
     display: flex;
     justify-content: space-between;
     align-items: center;

     .user-wrapper {
          display: flex;
          gap: var(--spacing);
          align-items: center;

          .user {
               display: flex;
               gap: var(--spacing);
               align-items: center;

               .pfp-status {
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

               .name {
                    font-weight: 700;
                    font-size: var(--font-big);
               }
          }
     }
`;
