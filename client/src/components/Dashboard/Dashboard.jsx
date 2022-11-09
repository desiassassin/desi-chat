import { useEffect } from "react";
import { fetchToken } from "../../lib/universalCookies";
import styled from "styled-components";
import Main from "./Main";
import LeftSidebar from "./LeftSidebar";

const Dashboard = () => {
     useEffect(() => {
          fetchToken("accessToken");
     });
     return (
          <MainWrapper>
               <LeftSidebar></LeftSidebar>
               <Main></Main>
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
