import styled from "styled-components";

export const Button = styled.button`
     position: relative;
     overflow: hidden;
     display: flex;
     align-items: center;
     justify-content: center;
     padding: 1em 2em;
     transition: background-color var(--transition-time);
     cursor: pointer;
     font-weight: 700;
     color: rgb(var(--font-bright));
     outline: none;
     border: none;
     border-radius: var(--border-radius);
     background-color: rgb(var(--accent-primary-dark));

     :hover {
          background-color: transparent;
          outline: 1px solid rgb(var(--accent-primary));
     }

     :focus {
          background-color: rgb(var(--accent-primary));
     }

     &.no-outline {
          outline: none;
     }

     .loader,
     .success,
     .failure {
          display: none;
          width: min-content;
          margin: auto;
          scale: 2.5;
     }
     &.loading {
          background-color: rgb(var(--accent-primary));
          .text,
          .success,
          .failure {
               display: none;
          }
          .loader {
               display: flex;
               animation: rotate 1s infinite linear;
               @keyframes rotate {
                    to {
                         rotate: 360deg;
                    }
               }
          }
     }
     &.loading-complete {
          background-color: rgb(var(--accent-secondary));
          outline: none;
          .text,
          .loader,
          .failure {
               display: none;
          }
          .success {
               display: flex;
          }
     }
     &.failed {
          background-color: rgb(var(--accent-error));
          .text,
          .loader,
          .success {
               display: none;
          }
          .failure {
               display: flex;
          }
     }
     span.ripple {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          scale: 0;
          translate: -50% -50%;
          animation: ripple 800ms linear;
          background-color: rgba(255, 255, 255, 0.5);
          /* background-color: rgba(0, 0, 0, 0.25); */
     }
     @keyframes ripple {
          to {
               scale: 2;
               opacity: 0;
          }
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
`;
