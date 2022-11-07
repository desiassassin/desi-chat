import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { RiChatSmile3Line } from "react-icons/ri";

const Navbar = () => {
     return (
          <>
               <NavbarWrapper>
                    <NavbarHome to="/">
                         <RiChatSmile3Line size="50px" />
                    </NavbarHome>
                    <NavbarLinks>
                         <li>
                              <Link to="/login" className="action">
                                   Get Started
                              </Link>
                         </li>
                    </NavbarLinks>
               </NavbarWrapper>
               <Outlet />
          </>
     );
};

export default Navbar;

const NavbarWrapper = styled.nav`
     display: flex;
     justify-content: space-between;
     gap: 16px;
     align-items: center;
     flex-wrap: wrap;
     flex-grow: 2;
     flex-shrink: 0;
     padding: calc(var(--spacing) / 2) var(--spacing);
     font-size: 0.75rem;
     min-width: 300px;
     background-color: transparent;
`;

const NavbarHome = styled(Link)`
     text-decoration: none;
     font-size: 2rem;
     width: max-content;
     text-transform: uppercase;
     color: rgb(var(--font-bright));

     svg {
          fill: rgb(var(--accent-primary));
          transition: fill 150ms;

          :hover {
               fill: rgb(var(--accent-primary-dark));
          }
     }
`;

const NavbarLinks = styled.ul`
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     gap: 2rem;
     list-style-type: none;
     font-size: 1.25rem;

     a {
          text-decoration: none;
          position: relative;
          color: rgb(var(--font-bright));

          &.action {
               background-color: rgb(var(--accent-primary));
               padding: 0.5em 1em;
               border-radius: 1em;
               transition: background-color 150ms;

               :hover {
                    background-color: rgb(var(--accent-primary-dark));
               }
          }
     }
     a::before {
          content: "";
          position: absolute;
          width: 0;
          inset: calc(100% - 1px) 0 0 0;
          transition: width 100ms;
          transform-origin: left;
     }
     a:hover::before {
          width: 100%;
     }
     a::after {
          content: "";
          position: absolute;
          width: 0;
          inset: 0 0 calc(100% - 1px) 0;
          transition: width 100ms;
          transform-origin: right;
     }
     a:hover::after {
          width: 50%;
     }
`;
