import { useEffect, useState } from "react";
import styled from "styled-components";
import { RiChatSmile3Line, RiCheckLine, RiCloseLine, RiLoader3Line } from "react-icons/ri";
import isEmpty from "validator/es/lib/isEmpty";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import socket from "../../lib/socket";
import Axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./GetStarted";

const Register = () => {
     // const [username, setUsername] = useState({error: false, message: "", value: ""});
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");

     useEffect(() => {
          // socket.on("register-username-change", ({ message }) => toggleErrors({ elementName: "username", message, show: message ? true : false }));
          socket.on("register-username-change", ({ message }) => message && toggleErrors({ elementName: "username", message, show: true }));
          return () => socket.removeAllListeners("register-username-change");
     }, []);

     const handleUsernameChange = (e) => {
          const username = e.target.value;
          setUsername(username);
          socket.emit("register-username-change", { username });

          if (isEmpty(username)) {
               toggleErrors({ elementName: "username", message: `Username can't be empty.`, show: true });
          } else if (/[^a-zA-Z0-9_]/.test(username)) {
               toggleErrors({ elementName: "username", message: "Username can only contain alpha-numeric character [A-Z][0-9]UNDERSCORE", show: true });
          } else if (username.length < 3 || username.length > 50) toggleErrors({ elementName: "username", message: "Username must be 3 - 50 characters long.", show: true });
          else toggleErrors({ elementName: "username" });
     };
     const handlePasswordChange = (e) => {
          const password = e.target.value;
          setPassword(password);
          if (isEmpty(password)) {
               toggleErrors({ elementName: "password", message: `Password can't be empty.`, show: true });
          } else if (
               !isStrongPassword(password, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 0,
                    minNumbers: 0,
                    minSymbols: 0,
               })
          ) {
               toggleErrors({ elementName: "password", message: "Password must contain atleast 8 characters.", show: true });
          } else toggleErrors({ elementName: "password" });
     };

     const validate = () => {
          // clear previous errors
          ["username", "password"].forEach((input) => toggleErrors({ elementName: input }));
          let errors = [];

          // firstName
          if (isEmpty(username)) {
               errors.push({ elementName: "username", message: `Username can't be empty.`, show: true });
          } else if (/[^a-zA-Z0-9_]/.test(username)) {
               errors.push({ elementName: "username", message: "Username can only contain alpha-numeric character [A-Z][0-9]UNDERSCORE", show: true });
          }

          // password
          if (isEmpty(password)) {
               errors.push({ elementName: "password", message: `Password can't be empty.`, show: true });
          } else if (
               !isStrongPassword(password, {
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
                    toggleErrors({ elementName, message, show });
               }
               return false;
          }
          return true;
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const button = e.currentTarget;
          const validated = validate();

          if (validated) {
               try {
                    // disable the button and set it's state to loading
                    button.disabled = true;
                    button.classList.add("loading");

                    // create user
                    const response = await Axios({
                         method: "POST",
                         url: `${process.env.REACT_APP_BASE_URL}/register`,
                         data: { username: username, password: password },
                    });

                    if (response.status === 200 && response.data.message === "Registered") {
                         setTimeout(() => {
                              button.classList.remove("loading");
                              button.classList.add("loading-complete");
                              toast.info("Account created successfully!");
                         }, 2000);
                    }
               } catch (error) {
                    const { message } = error?.response?.data;
                    setTimeout(() => {
                         button.classList.remove("loading");
                         button.classList.add("failed");

                         if (message?.code === 11000) {
                              const value = message.keyValue[Object.keys(message.keyValue)];
                              return toggleErrors({ elementName: "username", message: `"${value}" is already taken. Please use another one.`, show: true });
                         } else if (message?.errors) {
                              Object.entries(message?.errors).forEach(([key, { message }]) => toggleErrors({ elementName: key, message, show: true }));
                         }
                    }, 2000);
               } finally {
                    setTimeout(() => {
                         button.classList.remove("loading");
                         button.classList.remove("loading-complete");
                         button.classList.remove("failed");
                         button.disabled = false;
                    }, 4000);
               }
          }
     };

     const toggleErrors = ({ elementName, message = "", show = false }) => {
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
               {/* <form onSubmit={handleSubmit}> */}
               <form>
                    <div className="form__group field">
                         <input
                              autoComplete="chrome-off"
                              type="text"
                              className="form__field"
                              placeholder="Username"
                              name="username"
                              id="register-username"
                              value={username}
                              onChange={handleUsernameChange}
                              maxLength={50}
                         />
                         <label htmlFor="register-username" className="form__label">
                              Username
                         </label>
                         <div id="register-username-error" className="error">
                              Is this even gonna work?
                         </div>
                    </div>
                    <div className="form__group field">
                         <input
                              autoComplete="off"
                              type="password"
                              className="form__field"
                              placeholder="Password"
                              name="passsword"
                              id="register-password"
                              value={password}
                              onChange={handlePasswordChange}
                              maxLength={64}
                         />
                         <label htmlFor="register-password" className="form__label">
                              Password
                         </label>
                         <div id="register-password-error" className="error">
                              Is this even gonna work?
                         </div>
                    </div>
                    <Button className="ripple" type="submit" onClick={handleSubmit}>
                         <div className="text">Sign Up</div>
                         <div className="loader">
                              <RiLoader3Line size="16px" />
                         </div>
                         <div className="success">
                              <RiCheckLine size="16px" />
                         </div>
                         <div className="failure">
                              <RiCloseLine size="16px" />
                         </div>
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
