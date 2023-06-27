import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Main = () => {
     return (
          <Wrapper>
               <Outlet />
          </Wrapper>
     );
};

export default Main;

const Wrapper = styled.div`
     flex: 4;
     height: calc(100vh - var(--spacing) * 2);
     border-radius: var(--border-radius);
     background-color: rgb(var(--bg-light));
     backdrop-filter: blur(10px);
     /* background-color: transparent; */
     outline: 1px solid rgb(var(--bg-light));
     overflow: hidden;

     @media (max-width: 900px) {
          height: 100dvh;
     }
`;
