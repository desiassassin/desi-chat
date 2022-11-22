import Axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import styled from "styled-components";
import { fetchToken } from "../../lib/universalCookies";
import * as ACTIONS from "../../redux/actions";
import store from "../../redux/store";
import Main from "./Main";
import LeftSidebar from "./Sidebar/LeftSidebar";

let query = { username: null, _id: null };
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
               query._id = user._id;

               socket.connect();
          }

          return () => {
               socket.disconnect();
          };
     }, [user.username, user._id]);

     useEffect(() => {
          socket.on("friend-request-received", ({ _id, username }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.REQUEST_RECEIVED, payload: { _id, username } });
               toast.info(`New request from ${username}`);
          });

          socket.on("friend-request-accepted", ({ acceptedByUser, _id, newConversation }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.REQUEST_ACCEPTED, payload: { acceptedByUser, _id } });
               store.dispatch({ type: ACTIONS.FRIENDS.CONVERSATION_CREATED, payload: { newConversation } });
               toast.info(`${acceptedByUser} accepted your friend request.`);
          });

          socket.on("friend-removed", ({ removedByUser, _id }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.UNFRIEND, payload: { removedByUser, _id } });
          });

          socket.on("friend-request-cancelled", ({ cancelledByUser, _id }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.REQUEST_CANCELLED, payload: { cancelledByUser, _id } });
          });

          socket.on("friend-request-rejected", ({ rejectedByUser, _id }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.REQUEST_REJECTED, payload: { rejectedByUser, _id } });
          });

          socket.on("friend-came-online", ({ friendWhoCameOnline, _id }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.CAME_ONLINE, payload: { friendWhoCameOnline, _id } });
          });

          socket.on("friend-went-offline", ({ friendWhoWentOffline, _id }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.WENT_OFFLINE, payload: { friendWhoWentOffline, _id } });
          });

          socket.on("personal-message", ({ message }) => {
               store.dispatch({ type: ACTIONS.FRIENDS.PERSONAL_MESSAGE, payload: { message } });
          });

          return () => {
               socket.off("friend-request-recieved");
               socket.off("friend-request-accepted");
               socket.off("friend-removed");
               socket.off("friend-request-cancelled");
               socket.off("friend-request-rejected");
               socket.off("friend-came-online");
               socket.off("friend-went-offline");
               socket.off("personal-message");
          };
     }, []);

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
