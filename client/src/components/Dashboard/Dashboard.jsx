import Axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import styled from "styled-components";
import { fetchToken } from "../../lib/universalCookies";
import * as ACTIONS from "../../redux/actions";
import store from "../../redux/store";
import Main from "./Main";
import LeftSidebar from "./Sidebar/LeftSidebar";

let query = { username: null, id: null };
export const socket = io(`${process.env.REACT_APP_BASE_URL}/users`, {
     autoConnect: false,
     query,
     // auth: cookies.get("accessToken")
});

const Dashboard = () => {
     const user = useSelector((state) => state.user);

     useEffect(() => {
          if (user.username) {
               query.username = user.username;
               query.id = user.id;

               socket.connect();
          }

          return () => {
               socket.disconnect();
          };
     }, [user.username, user.id]);

     useEffect(() => {
          (async function () {
               const token = fetchToken("accessToken");
               if (token) {
                    try {
                         const response = await Axios({
                              method: "post",
                              headers: { authorization: `Bearer ${token}` },
                              url: `${process.env.REACT_APP_BASE_URL}/login`,
                         });
                         if (response.status === 200 && response.data.message === "Authenticated") {
                              const { user } = response.data;
                              store.dispatch({ type: ACTIONS.USER.LOGGED_IN, payload: user });
                         }
                    } catch (error) {
                         console.log(error.message);
                    }
               }
          })();
     }, []);
     return (
          <MainWrapper>
               <LeftSidebar />
               <Main />
          </MainWrapper>
     );
};

export default Dashboard;

const MainWrapper = styled.div`
     display: flex;
     justify-content: center;
     align-items: center;
     gap: calc(var(--spacing) * 1);
     min-height: 100vh;
     padding: calc(var(--spacing) * 1);
`;
