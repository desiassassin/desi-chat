import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { RiChatSmile3Line } from "react-icons/ri";
import { isEmpty, isStrongPassword } from "validator";
import socket from "../../lib/socket";
import Axios from "axios";
import { Button } from "./GetStarted";

const Register = () => {
     const [registerUsername, setRegisterUsername] = useState("");
     const registerPasswordRef = useRef();

     useEffect(() => {
          socket.on("register-username-change", ({ message }) => toggleRegistrationErrors({ elementName: "username", message, show: message ? true : false }));
          return () => socket.removeAllListeners("register-username-change");
     }, []);

     const handleRegisterUsernameChange = (e) => {
          const username = e.target.value;
          setRegisterUsername(username);
          socket.emit("register-username-change", { username });
     };

     const validateRegister = () => {
          // clear previous errors
          ["username", "password"].forEach((input) => toggleRegistrationErrors({ elementName: input }));
          let errors = [];

          // firstName
          if (isEmpty(registerUsername)) {
               errors.push({ elementName: "username", message: `Username can't be empty.`, show: true });
          } else if (/[^a-zA-Z0-9_]/.test(registerUsername)) {
               errors.push({ elementName: "username", message: "Username can only contain alpha-numeric character [A-Z][0-9]UNDERSCORE", show: true });
          }

          // password
          if (isEmpty(registerPasswordRef.current.value)) {
               errors.push({ elementName: "password", message: `Password can't be empty.`, show: true });
          } else if (
               !isStrongPassword(registerPasswordRef.current.value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 0,
                    minNumbers: 0,
                    minSymbols: 0,
               })
          ) {
               errors.push({ elementName: "password", message: "Password must contain atleast 8 characters.", show: true });
          }

          if (errors.length) {
               for (const error of errors) {
                    const { elementName, message, show } = error;
                    toggleRegistrationErrors({ elementName, message, show });
               }
               return false;
          }
          return true;
     };

     const handleRegisterSubmit = async (e) => {
          e.preventDefault();

          if (validateRegister()) {
               // create user
               try {
                    const response = await Axios({
                         method: "POST",
                         url: `${process.env.REACT_APP_BASE_URL}/register`,
                         data: { username: registerUsername, password: registerPasswordRef.current.value },
                    });

                    if (response.status === 200 && response.data.message === "Registered") console.log("Registered");
               } catch (error) {
                    const { message } = error?.response?.data;
                    if (message?.code === 11000) {
                         const value = message.keyValue[Object.keys(message.keyValue)];
                         return toggleRegistrationErrors({ elementName: "username", message: `"${value}" is already taken. Please use another one.`, show: true });
                    } else if (message?.errors) {
                         Object.entries(message?.errors).forEach(([key, { message }]) => toggleRegistrationErrors({ elementName: key, message, show: true }));
                    }
               }
          }
     };

     const toggleRegistrationErrors = ({ elementName, message = "", show = false }) => {
          const element = document.getElementById(`register-${elementName}-error`);
          const { parentElement } = element;

          if (show) {
               parentElement.classList.add("error");
               element.innerText = message;
               return;
          }

          parentElement.classList.remove("error");
          element.innerText = message;
     };
     return (
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
                              id="registerUsername"
                              value={registerUsername}
                              onChange={handleRegisterUsernameChange}
                         />
                         <label htmlFor="register-username" className="form__label">
                              Username
                         </label>
                         <div id="register-username-error" className="error">
                              Is this even gonna work?
                         </div>
                    </div>
                    <div className="form__group field">
                         <input ref={registerPasswordRef} autoComplete="off" type="password" className="form__field" placeholder="Password" name="passsword" id="register-password" />
                         <label htmlFor="RegisterPassword" className="form__label">
                              Password
                         </label>
                         <div id="register-password-error" className="error">
                              Is this even gonna work?
                         </div>
                    </div>
                    <Button className="ripple" type="submit">
                         Sign Up
                    </Button>
               </form>
          </SignUp>
     );
};
export default Register;

const SignUp = styled.div`
     display: flex;
     flex-direction: column;
     gap: calc(var(--spacing) * 2);
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
          border: 1px solid rgb(var(--accent-primary));
     }

     form {
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing) * 2);

          input {
               background-color: transparent;
               backdrop-filter: blur(100px);
               letter-spacing: 2px;
          }
     }
`;
