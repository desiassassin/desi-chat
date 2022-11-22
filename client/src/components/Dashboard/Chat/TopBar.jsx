import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import { BiInfoCircle } from "react-icons/bi";
import { PfpStatus } from "../Misc";
import { useNavigate } from "react-router-dom";

const TopBar = ({ username, status = "Offline" }) => {
     const navigate = useNavigate();
     const gotoHome = (event) => {
          navigate("/me");
     };
     return (
          <TopBarWrapper>
               <div className="user-wrapper">
                    <IoArrowBack className="back" size="25px" onClick={gotoHome} />
                    <div className="user">
                         <PfpStatus status={status} size="30px" />
                         <div className="name">{username}</div>
                    </div>
               </div>
               <BiInfoCircle className="info" size="25px" />
          </TopBarWrapper>
     );
};

export default TopBar;

const TopBarWrapper = styled.div`
     padding: calc(var(--spacing) / 2) var(--spacing);
     background-color: rgb(var(--bg-dark));
     display: flex;
     justify-content: space-between;
     align-items: center;

     .user-wrapper {
          display: flex;
          gap: calc(var(--spacing) * 2);
          align-items: center;

          .back {
               cursor: pointer;
          }

          .user {
               display: flex;
               gap: var(--spacing);
               align-items: center;

               .name {
                    font-weight: 700;
                    font-size: var(--font-big);
               }
          }
     }

     .info {
          cursor: pointer;
     }
`;
