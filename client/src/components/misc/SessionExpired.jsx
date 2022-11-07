import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "./Button";

const open = () => document.getElementById("session-expired")?.classList?.add("show");
const close = () => document.getElementById("session-expired")?.classList?.remove("show");

const SessionExpired = () => {
     const navigate = useNavigate();
     const closeAndRedirectToLogin = () => {
          navigate("/login", { replace: true });
          close();
     };
     return (
          <div id="session-expired" className="backdrop">
               <Modal>
                    <h1>Session Expired!</h1>
                    <p>Your current session has expired. Please log in again to continue.</p>
                    <Button className="btn no-outline" onClick={closeAndRedirectToLogin}>
                         Go back to login
                    </Button>
               </Modal>
          </div>
     );
};

export default Object.assign(SessionExpired, { open, close });

const Modal = styled.div`
     position: fixed;
     inset: 0;
     z-index: 100;
     display: flex;
     flex-direction: column;
     gap: 1rem;
     align-items: center;
     margin: auto;
     padding: 1rem;
     width: clamp(300px, 100%, 500px);
     min-height: fit-content;
     height: fit-content;
     max-height: 500px;
     overflow-y: auto;
     background-color: rgb(var(--bg-light));
     border-radius: 10px;
     * {
          color: rgb(var(--font-bright));
          margin: 0;
          text-align: center;
     }

     h1 {
          color: rgb(var(--accent-error));
     }
     button {
          min-width: 300px;
          background-color: rgb(var(--accent-error));
          transition: background-color var(--transition-time);
          :hover {
               background-color: rgb(var(--accent-error), 0.5);
          }
     }
`;
