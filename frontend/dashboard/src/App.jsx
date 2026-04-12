import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./pages/Sidebar";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Resource_Usage from "./components/Resource_Usage";
import Test_History from "./components/Test_History";
import Sandboxes from "./components/Sandboxes";

function App() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <BrowserRouter>
        <div className="flex ">
          <Sidebar />

          <div className="flex-1 flex flex-col">
            <Navbar />

            <Routes>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/Sandboxes" element= {<Sandboxes/>} />
              <Route path="/Resource Usage" element={<Resource_Usage/>} /> 
              <Route path="/Test History" element={<Test_History/>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
