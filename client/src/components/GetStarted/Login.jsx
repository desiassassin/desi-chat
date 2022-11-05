import { useState } from "react";
import styled from "styled-components";
import { RiChatSmile3Line } from "react-icons/ri";
import { Button } from "./GetStarted";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import isEmpty from "validator/es/lib/isEmpty";

const Login = () => {
     const navigate = useNavigate();
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");

     const handleUsernameChange = (e) => {
          toggleErrors({ elementName: "username" });
          setUsername(e.target.value);
     };
     const handlePasswordChange = (e) => {
          toggleErrors({ elementName: "password" });
          setPassword(e.target.value);
     };
     const validate = () => {
          ["username", "password"].forEach((input) => toggleErrors({ elementName: input }));
          let errors = [];

          // username
          if (isEmpty(username)) errors.push({ elementName: "username", message: `Username can't be empty.`, show: true });
          // password
          if (isEmpty(password)) errors.push({ elementName: "password", message: `Password can't be empty.`, show: true });

          if (errors.length) {
               for (const error of errors) {
                    const { elementName, message, show } = error;
                    toggleErrors({ elementName, message, show });
               }
               return false;
          }
          return true;
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

          const validated = validate();

          if (validated) {
               // request
               try {
                    const response = await Axios({ method: "POST", baseURL: `${process.env.REACT_APP_BASE_URL}/login`, data: { username, password } });
                    console.log(response.data);

                    if (response.status === 200 && response.data.message === "Authenticated") {
                         // cookies.set("accessToken", response.data.user.accessToken, { path: "/" });
                         // const { user } = response.data;
                         // store.dispatch({ type: ACTIONS.USER.LOGGED_IN, payload: user });
                         navigate("/chat");
                    }
               } catch (error) {
                    if (error?.message === "Network Error") return toggleErrors("Couldn't connect to server. Please try again later.");
                    else if (error?.response?.data?.message) {
                         const { message } = error.response.data;
                         if (message === "Username does not exists.") toggleErrors({ elementName: "username", message: `${error.response.data.message}`, show: true });
                         else if (message === "Wrong password.") toggleErrors({ elementName: "password", message: `${error.response.data.message}`, show: true });
                    }
               }
          }
     };
     return (
          <LogIn>
               <div className="header">
                    <RiChatSmile3Line fill="rgb(var(--accent-primary))" size="80px" />
                    <h1>Connect to your family & friends with Desi Chat</h1>
                    {/* <p>Just pick a username & password. Wallah! it's that simple.</p> */}
               </div>
               <hr />
               <form onSubmit={handleLoginSubmit}>
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
                    </div>
                    <Button className="ripple" type="submit">
                         Log In
                    </Button>
               </form>
          </LogIn>
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
`;
