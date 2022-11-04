import { useEffect, useState } from "react";
import styled from "styled-components";
import { RiChatSmile3Line } from "react-icons/ri";

const GetStarted = () => {
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");

     const handleRegisterSubmit = (e) => {
          e.preventDefault();
     };

     useEffect(() => {
          function createRipple(event) {
               const button = event.currentTarget;
               const circle = document.createElement("span");
               // diameter = greatest of button's height or width
               const diameter = Math.max(button.clientWidth, button.clientHeight);

               circle.style.width = circle.style.height = `${diameter}px`;
               const rect = button.getBoundingClientRect();
               circle.style.left = event.clientX - rect.left + "px";
               circle.style.top = event.clientY - rect.top + "px";

               circle.classList.add("ripple");
               const ripple = button.getElementsByClassName("ripple")[0];
               if (ripple) ripple.remove();
               button.appendChild(circle);
          }

          const buttons = document.getElementsByTagName("button");
          buttons.forEach((button) => (button.onclick = createRipple));

          return () => {
               buttons.forEach((button) => (button.onclick = null));
          };
     });

     return (
          <MainWrapper>
               <Wrapper>
                    <SignUp>
                         <div className="header">
                              <RiChatSmile3Line fill="rgb(var(--accent-primary))" size="80px" />
                              <h1>Get started with Desi Chat</h1>
                              <p>Just pick a username & password. Wallah! it's that simple.</p>
                         </div>
                         <hr />
                         <form onSubmit={handleRegisterSubmit}>
                              <div className="form__group field">
                                   <input
                                        autoComplete="chrome-off"
                                        type="text"
                                        className="form__field"
                                        placeholder="Username"
                                        name="username"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                   />
                                   <label htmlFor="username" className="form__label">
                                        Username
                                   </label>
                              </div>
                              <div className="form__group field">
                                   <input
                                        autoComplete="off"
                                        type="password"
                                        className="form__field"
                                        placeholder="Password"
                                        name="passsword"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                   />
                                   <label htmlFor="password" className="form__label">
                                        Password
                                   </label>
                              </div>
                              <div id="register-error"></div>
                              <Button className="ripple" type="submit">
                                   Sign Up
                              </Button>
                         </form>
                    </SignUp>
               </Wrapper>
               <Wrapper>
                    <LogIn></LogIn>
               </Wrapper>
          </MainWrapper>
     );
};

export default GetStarted;

const MainWrapper = styled.div`
     display: flex;
     gap: calc(var(--spacing) * 2);
     flex-wrap: wrap;
     padding: calc(var(--spacing) * 2);
`;
const Wrapper = styled.div`
     min-width: 300px;
     width: 600px;
     max-width: 600px;
     background-color: rgb(var(--bg-light));
     /* min-height: 600px; */

     border-radius: var(--border-radius);
     margin-inline: auto;

     background-color: transparent;
     backdrop-filter: blur(5px);
     border: 2px solid rgb(var(--accent-primary));
`;
const SignUp = styled.div`
     padding: calc(var(--spacing) * 2);

     .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing);

          h1 {
               font-size: 20px;
               text-align: center;
          }
          p {
               line-height: 1.5;
               text-align: center;
          }
     }

     hr {
          margin-block: var(--spacing);
          border: 1px solid rgb(var(--accent-primary));
     }

     form {
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing) * 2);

          margin-block: calc(var(--spacing) * 2);

          input {
               letter-spacing: 2px;
          }
     }
`;
const LogIn = styled.div``;
const Button = styled.button`
     position: relative;
     overflow: hidden;

     padding: 1em 1em;
     transition: background-color 250ms;
     cursor: pointer;
     font-weight: 700;
     color: rgb(var(--font-bright));
     outline: none;
     border: none;
     border-radius: var(--border-radius);
     background-color: rgb(var(--accent-primary-dark));

     /* &.ripple {
          background-position: center;
          transition: background 1000ms;
          :hover {
               background: rgb(var(--accent-primary)) radial-gradient(circle, transparent 1%, rgb(var(--accent-primary)) 1%) center/15000%;
          }
          :active {
               background-color: rgb(var(--accent-primary-dark));
               background-size: 100%;
               transition: background 0s;
          }
     } */

     span.ripple {
          position: absolute;
          pointer-events: none;
          /* top: 50%; */
          /* left: 0; */
          border-radius: 50%;
          scale: 0;
          translate: -50% -50%;
          animation: ripple 800ms linear;
          background-color: rgba(255, 255, 255, 0.7);
     }

     @keyframes ripple {
          to {
               scale: 4;
               opacity: 0;
          }
     }
`;
