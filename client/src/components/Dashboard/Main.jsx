import styled from "styled-components";

const Main = () => {
     return <Wrapper></Wrapper>;
};

export default Main;

const Wrapper = styled.div`
     flex: 4;
     height: calc(100vh - var(--spacing) * 2);
     border-radius: var(--border-radius);
     background-color: rgb(var(--bg-light));
     backdrop-filter: blur(20px);
     /* background-color: transparent; */
`;
