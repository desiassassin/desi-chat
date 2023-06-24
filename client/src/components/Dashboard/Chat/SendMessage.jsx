import { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import styled from "styled-components";
import { socket } from "../Dashboard";

const SendMessage = ({ friend, conversation }) => {
     const [message, setMessage] = useState("");

     useEffect(() => {
          socket.on("personal-message-response", (message) => {
               toast.error(message);
          });

          return () => {
               socket.off("personal-message-response");
          };
     }, []);

     const handleMessageChange = (event) => {
          setMessage(event.target.value);
     };
     const sendMessage = (event) => {
          event.preventDefault();
          if(!message) return;
          const { sendto, _id } = event.currentTarget.dataset;
          socket.emit("personal-message", { content: message, messageTo: sendto, _id, conversationId: conversation._id });
          setMessage("");
     };
     return (
          <Wrapper className="">
               <form className="wrapper" onSubmit={sendMessage} data-sendto={friend?.username} data-_id={friend?._id}>
                    <input type="text" name="message" id="message" className="message" placeholder={`Message @${friend?.username}`} value={message} onChange={handleMessageChange} />
                    <button type="submit" className="send" disabled={!message}>
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

               :disabled {
                    opacity: 0.5;
               }

               svg {
                    fill: rgb(var(--accent-primary));
               }
          }
     }
`;
