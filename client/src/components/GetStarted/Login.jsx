import Axios from "axios";
import { useEffect, useRef, useState } from "react";
import { RiChatSmile3Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import isEmpty from "validator/es/lib/isEmpty";
import cookies from "../../lib/universalCookies";
import { MainWrapper, Wrapper } from "./misc";
import { Button } from "../misc/Button";
import store from "../../redux/store";
import * as ACTIONS from "../../redux/actions";

const Login = () => {
     const initialRender = useRef(true);
     const navigate = useNavigate();
     const [errors, setErrors] = useState({ username: { message: "", show: true }, password: { message: "", show: true } });
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");

     useEffect(() => {
          for (const [elementName, { message, show }] of Object.entries(errors)) {
               !initialRender.current && toggleErrors({ elementName, message, show });
          }
          initialRender.current = false;
     }, [errors]);

     useEffect(() => {
          (async function () {
               const token = cookies.get("accessToken");
               if (token) {
                    try {
                         const response = await Axios({
                              method: "post",
                              headers: { authorization: `Bearer ${token}` },
                              url: `${import.meta.env.VITE_APP_BASE_URL}/login`,
                         });
                         if (response.status === 200 && response.data.message === "Authenticated") {
                              navigate("/me", { replace: true });
                         }
                    } catch (error) {
                         console.log(error.message);
                    }
               }
          })();
     }, [navigate]);

     const handleUsernameChange = (e) => {
          const { value } = e.target;
          const elementName = "username";
          let message = "";

          if (isEmpty(value)) message = `Username can't be empty.`;

          setErrors((errors) => ({ ...errors, [elementName]: { message, show: message ? true : false } }));
          setUsername(value);
     };
     const handlePasswordChange = (e) => {
          const { value } = e.target;
          const elementName = "password";
          let message = "";

          if (isEmpty(value)) message = `Password can't be empty.`;

          setPassword(value);
          setErrors((errors) => ({ ...errors, [elementName]: { message, show: message ? true : false } }));
     };
     const toggleErrors = ({ elementName, message = "", show = false }) => {
          const element = document.getElementById(`login-${elementName}-error`);
          const { parentElement } = element;

          if (show) {
               parentElement.classList.add("error");
               element.innerText = message;
               return;
          }

          parentElement.classList.remove("error");
          element.innerText = message;
     };

     const handleLoginSubmit = async (e) => {
          e.preventDefault();

          // const validated = validate();
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

          // request
          try {
               const response = await Axios({ method: "POST", baseURL: `${import.meta.env.VITE_APP_BASE_URL}/login`, data: { username, password } });

               if (response.status === 200 && response.data.message === "Authenticated") {
                    cookies.set("accessToken", response.data.user.accessToken, { path: "/" });
                    const { user } = response.data;
                    store.dispatch({ type: ACTIONS.USER.LOGGED_IN, payload: user });
                    navigate("/me", { replace: true });
               }
          } catch (error) {
               if (error?.message === "Network Error") return toggleErrors("Couldn't connect to server. Please try again later.");
               else if (error?.response?.data?.message) {
                    const { message } = error.response.data;
                    if (message === "Username does not exists.") toggleErrors({ elementName: "username", message: `${error.response.data.message}`, show: true });
                    else if (message === "Wrong password.") toggleErrors({ elementName: "password", message: `${error.response.data.message}`, show: true });
               }
          }
     };
     return (
          <MainWrapper>
               <Wrapper>
                    <LogIn>
                         <div className="header">
                              <RiChatSmile3Line fill="rgb(var(--accent-primary))" size="80px" />
                              <h1>Sign in into Desi Chat</h1>
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
                                        id="login-username"
                                        value={username}
                                        onChange={handleUsernameChange}
                                   />
                                   <label htmlFor="login-username" className="form__label">
                                        Username
                                   </label>
                                   <div id="login-username-error" className="error"></div>
                              </div>
                              <div className="form__group field">
                                   <input
                                        autoComplete="off"
                                        type="password"
                                        className="form__field"
                                        placeholder="Password"
                                        name="passsword"
                                        id="login-password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                   />
                                   <label htmlFor="login-password" className="form__label">
                                        Password
                                   </label>
                                   <div id="login-password-error" className="error"></div>
                                   <div
                                        className="show-password hidden"
                                        onClick={(e) => {
                                             const { currentTarget } = e;
                                             const password = document.getElementById("login-password");
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
                              <Button className="ripple" type="submit" onClick={handleLoginSubmit}>
                                   Log In
                              </Button>
                         </form>
                         <div className="redirect">
                              Need an account?
                              <Link to="/register">Register</Link>
                         </div>
                    </LogIn>
               </Wrapper>
          </MainWrapper>
     );
};

export default Login;

const LogIn = styled.div`
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
