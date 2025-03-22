import React, { useState, useEffect } from "react";

const Dashboard = () => {
    const [locations, setLocations] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:5000/api/dashboard", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(data => {
            setLocations(data);
        })
        .catch(error => console.error("Error:", error));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <ul>
                {locations.map((location) => (
                    <li key={location.id}>
                        <a href={`/map/${location.id}`}>{location.title}</a> 
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
