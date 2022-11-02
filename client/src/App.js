import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Chat from "./components/chat/Chat";
import HomePage from "./components/homepage/HomePage";

function App() {
     return (
          <Router>
               <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<Chat />} />
               </Routes>
          </Router>
     );
}

export default App;
