import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import MapView from "./components/MapView";
import Login from "./components/Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map/:id" element={<MapView />} />
            </Routes>
        </Router>
    );
}

export default App;
