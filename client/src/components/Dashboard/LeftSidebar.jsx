import styled from "styled-components";
import SidebarChat from "./SidebarChat";

const LeftSidebar = () => {
     return (
          <Wrapper>
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
               <SidebarChat />
          </Wrapper>
     );
};

export default LeftSidebar;

const Wrapper = styled.div`
     flex: 1;
     width: 100%;
     max-width: 300px;
     /* height: 100%; */
     height: calc(100vh - var(--spacing) * 4);
     background-color: rgb(var(--bg-light));
     border-radius: var(--border-radius);
     background-color: transparent;
     backdrop-filter: blur(20px);
     overflow-y: auto;
`;
