import styled from "styled-components";

export const MainWrapper = styled.div`
     display: flex;
     padding: calc(var(--spacing) * 2);
`;
export const Wrapper = styled.div`
     min-width: 300px;
     width: 600px;
     max-width: 600px;
     background-color: rgb(var(--bg-light));
     /* min-height: 600px; */
     border-radius: var(--border-radius);
     margin-inline: auto;
     background-color: transparent;
     backdrop-filter: blur(10px);

     border: 2px solid rgb(var(--accent-primary));
`;

// export const RippleButton = ({ text, style, children, onClick, dontCreateNewDiv }) => {
//      const createRipple = (event) => {
//           const button = event.currentTarget;
//           const circle = document.createElement("span");
//           // diameter = greatest of button's height or width
//           const diameter = Math.max(button.clientWidth, button.clientHeight);

//           circle.style.width = circle.style.height = `${diameter}px`;
//           const rect = button.getBoundingClientRect();
//           circle.style.left = event.clientX - rect.left + "px";
//           circle.style.top = event.clientY - rect.top + "px";

//           circle.classList.add("ripple");
//           const ripple = button.getElementsByClassName("ripple")[0];
//           if (ripple) ripple.remove();
//           button.appendChild(circle);
//      };

//      return (
//           <Button style={style} className="ripple" onClick={onClick}>
//                {dontCreateNewDiv ? (
//                     children
//                ) : (
//                     <div className="btn" onClick={createRipple}>
//                          {children}
//                     </div>
//                )}
//           </Button>
//      );
// };
