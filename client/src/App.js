import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import GetStarted from "./components/GetStarted/GetStarted";
import Chat from "./components/Chat/Chat";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navbar";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
     return (
          <Router>
               <ToastContainer autoClose={5000} position="bottom-left" theme="colored" draggable draggableDirection="x" draggablePercent={30} limit={5} />
               <Routes>
                    <Route path="/" element={<Navbar />}>
                         <Route path="/" element={<HomePage />} />
                         <Route path="/getStarted" element={<GetStarted />} />
                    </Route>
                    <Route path="/chat" element={<Chat />} />
               </Routes>
          </Router>
     );
}

export default App;
