import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/GetStarted/Login";
import Register from "./components/GetStarted/Register";
import HomePage from "./components/HomePage/HomePage";
import SessionExpired from "./components/misc/SessionExpired";
import Navbar from "./components/Navbar";
import Chat from "./components/Dashboard/Chat/Chat";
import Home from "./components/Dashboard/Home";

function App() {
     return (
          <Router>
               <SessionExpired />
               <ToastContainer autoClose={5000} position="bottom-left" theme="colored" draggable draggableDirection="x" draggablePercent={30} limit={5} />
               <Routes>
                    <Route path="/" element={<Navbar />}>
                         <Route path="/" element={<HomePage />} />
                         <Route path="login" element={<Login />} />
                         <Route path="register" element={<Register />} />
                         <Route path="*" element={<HomePage />} />
                    </Route>
                    <Route path="/me" element={<Dashboard />}>
                         <Route path="/me/" element={<Home />} />
                         <Route path=":username" element={<Chat />} />
                    </Route>
               </Routes>
          </Router>
     );
}

export default App;
