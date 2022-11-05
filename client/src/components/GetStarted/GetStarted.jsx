import { useEffect } from "react";
import styled from "styled-components";
import Register from "./Register";
import Login from "./Login";

const GetStarted = () => {
     useEffect(() => {
          function createRipple(event) {
               const button = event.currentTarget;
               const circle = document.createElement("span");
               // diameter = greatest of button's height or width
               const diameter = Math.max(button.clientWidth, button.clientHeight);

               circle.style.width = circle.style.height = `${diameter}px`;
               const rect = button.getBoundingClientRect();
               circle.style.left = event.clientX - rect.left + "px";
               circle.style.top = event.clientY - rect.top + "px";

               circle.classList.add("ripple");
               const ripple = button.getElementsByClassName("ripple")[0];
               if (ripple) ripple.remove();
               button.appendChild(circle);
          }

          const buttons = document.getElementsByTagName("button");
          buttons.forEach((button) => (button.onclick = createRipple));

          return () => {
               buttons.forEach((button) => (button.onclick = null));
          };
     }, []);

     return (
          <MainWrapper>
               <Wrapper>
                    <Register />
               </Wrapper>
               <Wrapper>
                    <Login />
               </Wrapper>
          </MainWrapper>
     );
};

export default GetStarted;

const MainWrapper = styled.div`
     display: flex;
     gap: calc(var(--spacing) * 2);
     flex-wrap: wrap;
     padding: calc(var(--spacing) * 2);
`;
const Wrapper = styled.div`
     min-width: 300px;
     width: 600px;
     max-width: 600px;
     background-color: rgb(var(--bg-light));
     /* min-height: 600px; */
     border-radius: var(--border-radius);
     margin-inline: auto;

     background-color: transparent;
     backdrop-filter: blur(5px);
     border: 2px solid rgb(var(--accent-primary));
`;
export const Button = styled.button`
     position: relative;
     overflow: hidden;

     padding: 1em 1em;
     transition: background-color 250ms;
     cursor: pointer;
     font-weight: 700;
     color: rgb(var(--font-bright));
     outline: none;
     border: none;
     border-radius: var(--border-radius);
     background-color: rgb(var(--accent-primary-dark));

     :hover {
          background-color: rgb(var(--accent-primary));
     }

     /* &.ripple {
          background-position: center;
          transition: background 1000ms;
          :hover {
               background: rgb(var(--accent-primary)) radial-gradient(circle, transparent 1%, rgb(var(--accent-primary)) 1%) center/15000%;
          }
          :active {
               background-color: rgb(var(--accent-primary-dark));
               background-size: 100%;
               transition: background 0s;
          }
     } */

     span.ripple {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          scale: 0;
          translate: -50% -50%;
          animation: ripple 800ms linear;
          /* background-color: rgba(255, 255, 255, 0.5); */
          background-color: rgba(0, 0, 0, 0.25);
     }

     @keyframes ripple {
          to {
               scale: 2;
               opacity: 0;
          }
     }
`;
