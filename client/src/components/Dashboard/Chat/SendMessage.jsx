import styled from "styled-components";
import { IoMdSend } from "react-icons/io";
import { useState } from "react";

const SendMessage = ({ friend }) => {
     const [message, setMessage] = useState("");
     return (
          <Wrapper className="">
               <form className="wrapper" action="">
                    <input type="text" name="message" id="message" className="message" placeholder={`Message @${friend?.username}`} />
                    <button type="submit" className="send">
                         Send
                         <IoMdSend size="20px" />
                    </button>
               </form>
          </Wrapper>
     );
};

export default SendMessage;

const Wrapper = styled.div`
     padding: var(--spacing);

     .wrapper {
          display: flex;
          gap: var(--spacing);
          .message {
               width: 100%;
               border: none;
               outline: none;
               background-color: rgb(var(--bg-dark));
               color: rgb(var(--font-bright));
               border-radius: var(--border-radius);
               padding-inline: var(--spacing);
          }
          .send {
               padding: 10px 10px;
               display: flex;
               align-items: center;
               justify-content: center;
               gap: calc(var(--spacing) / 2);
               color: rgb(var(--accent-primary));
               font-weight: 700;
               border-radius: var(--border-radius);
               outline: none;
               border: none;
               background-color: rgb(var(--bg-dark));
               cursor: pointer;
               transition: background-color var(--transition-time);

               :hover {
                    background-color: rgb(var(--font-bright), 0.15);
               }

               svg {
                    fill: rgb(var(--accent-primary));
               }
          }
     }
`;
