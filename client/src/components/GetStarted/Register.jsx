import Axios from "axios";
import { useEffect, useRef, useState } from "react";
import { RiChatSmile3Line, RiCheckLine, RiCloseLine, RiEyeLine, RiEyeOffLine, RiLoader3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import isEmpty from "validator/es/lib/isEmpty";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import { MainWrapper, Wrapper } from "./misc";
import { Button } from "../misc/Button";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_APP_BASE_URL}/register`);
const Register = () => {
     const initialRender = useRef(true);
     const [errors, setErrors] = useState({
          username: { message: "", show: true },
          password: { message: "", show: true },
     });
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");

     useEffect(() => {
          socket.connect();
          return () => {
               socket.disconnect();
          };
     }, []);

     useEffect(() => {
          socket.on(
               "register-username-validated",
               ({ exists }) => exists && setErrors((errors) => ({ ...errors, username: { message: `"${username}" is already registered. Please choose another one.`, show: true } }))
          );
          return () => {
               socket.removeAllListeners("register-username-validated");
          };
     }, [username]);

     useEffect(() => {
          for (const [elementName, { message, show }] of Object.entries(errors)) {
               !initialRender.current && toggleErrors({ elementName, message, show });
          }
          initialRender.current = false;
     }, [errors]);

     const handleUsernameChange = (e) => {
          const { value } = e.target;
          const elementName = "username";
          let message = "";

          socket.emit("register-username-change", { username: value });

          // validations for username
          if (isEmpty(value)) {
               message = "Username can't be empty.";
          } else if (/[^a-zA-Z0-9_]/.test(value)) {
               message = "Username can only contain alpha-numeric character [A-Z][0-9]UNDERSCORE.";
          } else if (value.length < 3 || value.length > 50) {
               message = "Username must be 3 - 50 characters long.";
          }

          setErrors((errors) => ({ ...errors, [elementName]: { message, show: message ? true : false } }));
          setUsername(value);
     };
     const handlePasswordChange = (e) => {
          const { value } = e.target;
          const elementName = "password";
          let message = "";

          // validations for password
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

          setErrors((errors) => ({ ...errors, [elementName]: { message, show: message ? true : false } }));
          setPassword(value);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const button = e.currentTarget;
          const error = Object.fromEntries(
               Object.entries(errors)
                    .filter(([elementName, { show }]) => show)
                    .map(([elementName, { message, show }]) => [elementName, { message, show }])
          );
          const errorsExist = !!Object.keys(error).length;

          if (errorsExist) {
               for (const [elementName, { message, show }] of Object.entries(error)) {
                    toggleErrors({ elementName, message, show });
               }
               return;
          }

          // create user
          try {
               // disable the button and set it's state to loading
               button.disabled = true;
               button.classList.add("loading");

               const response = await Axios({
                    method: "POST",
                    url: `${import.meta.env.VITE_APP_BASE_URL}/register`,
                    data: { username, password },
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
                         return setErrors((errors) => ({ ...errors, username: { message: `"${value}" is already taken. Please use another one.`, show: true } }));
                    } else if (message?.errors) {
                         Object.entries(message?.errors).forEach(([key, { message }]) => setErrors((errors) => ({ ...errors, [key]: { message, show: true } })));
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
          <MainWrapper>
               <Wrapper>
                    <SignUp>
                         <div className="header">
                              <RiChatSmile3Line fill="rgb(var(--accent-primary))" size="80px" />
                              <h1>Create an account to get started.</h1>
                         </div>
                         <hr />
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
                                   <div id="register-username-error" className="error"></div>
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
                                   <div id="register-password-error" className="error"></div>
                                   <div
                                        className="show-password hidden"
                                        onClick={(e) => {
                                             const { currentTarget } = e;
                                             const password = document.getElementById("register-password");
                                             if (password.type === "password") {
                                                  password.type = "text";
                                                  currentTarget.classList.add("shown");
                                                  currentTarget.classList.remove("hidden");
                                             } else {
                                                  password.type = "password";
                                                  currentTarget.classList.add("hidden");
                                                  currentTarget.classList.remove("shown");
                                             }
                                        }}
                                   >
                                        <RiEyeLine className="show" />
                                        <RiEyeOffLine className="hide" />
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
                         <div className="redirect">
                              Do you already have an account?
                              <Link to="/login">Login</Link>
                         </div>
                    </SignUp>
               </Wrapper>
          </MainWrapper>
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
               letter-spacing: 2px;
          }
     }

     .redirect {
          text-align: center;

          a {
               color: rgb(var(--accent-primary));
               font-weight: 700;
               text-decoration: none;
               margin-left: 5px;
          }
     }
`;
