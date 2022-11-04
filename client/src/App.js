import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetStarted from "./components/GetStarted/GetStarted";
import Chat from "./components/Chat/Chat";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navbar";

function App() {
     return (
          <Router>
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
