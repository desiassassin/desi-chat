import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Chat from "./components/chat/Chat";
import HomePage from "./components/homepage/HomePage";
import Navbar from "./components/Navbar";

function App() {
     return (
          <Router>
               <Routes>
                    <Route path="/" element={<Navbar />}>
                         <Route path="/" element={<HomePage />} />
                         <Route path="/login" element={<Login />} />
                    </Route>
                    <Route path="/chat" element={<Chat />} />
               </Routes>
          </Router>
     );
}

export default App;
