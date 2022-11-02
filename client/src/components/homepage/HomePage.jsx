import { useEffect } from "react";

const HomePage = () => {
     useEffect(() => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.min.js";
          script.async = true;
          script.id = "p5js-lib";
          document.body.appendChild(script);

          return () => {
               const script = document.getElementById("p5js-lib").remove();
          };
     }, []);

     return <h1>HOME</h1>;
};

export default HomePage;
