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
     const [errors, setErrors] = useState({ username: { message: "Username can't be empty.", show: false }, password: { message: "Password can't be empty.", show: false } });
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");

     useEffect(() => {
          socket.on("register-username-change", ({ message }) => message && toggleErrors({ elementName: "username", message, show: true }));
          return () => socket.removeAllListeners("register-username-change");
     }, []);

     useEffect(() => {
          for (const [elementName, { message, show }] of Object.entries(errors)) {
               toggleErrors({ elementName, message, show });
          }
     }, [errors]);

     const handleUsernameChange = (e) => {
          const { value } = e.target;
          const elementName = "username";
          let message = "";

          socket.emit("register-username-change", { username: value });

          if (isEmpty(value)) {
               message = "Username can't be empty";
          } else if (/[^a-zA-Z0-9_]/.test(value)) {
               message = "Username can only contain alpha-numeric character [A-Z][0-9]UNDERSCORE";
          } else if (value.length < 3 || value.length > 50) {
               message = "Username must be 3 - 50 characters long.";
          }

          setErrors({ ...errors, [elementName]: { message, show: message ? true : false } });
          setUsername(value);
     };
     const handlePasswordChange = (e) => {
          const { value } = e.target;
          const elementName = "password";
          let message = "";

          if (isEmpty(value)) {
               message = `Password can't be empty.`;
          } else if (
               !isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 0,
                    minNumbers: 0,
                    minSymbols: 0,
               })
          ) {
               message = "Password must contain atleast 8 characters.";
          }

          setErrors({ ...errors, [elementName]: { message, show: message ? true : false } });
          setPassword(value);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const button = e.currentTarget;
          const errorsExist = !!Object.keys(errors).length;

          if (errorsExist) {
               for (const [elementName, { message, show }] of Object.entries(errors)) {
                    toggleErrors({ elementName, message, show });
               }
               return;
          }

          // create user
          console.log("creating");
          try {
               // disable the button and set it's state to loading
               button.disabled = true;
               button.classList.add("loading");

               const response = await Axios({
                    method: "POST",
                    url: `${process.env.REACT_APP_BASE_URL}/register`,
                    data: { username: username.value, password: password.value },
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
