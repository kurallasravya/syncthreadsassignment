import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError("Please log in to access the dashboard.");
            return;
        }

        fetch("http://localhost:5000/api/dashboard", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch locations");
            }
            return response.json();
        })
        .then(data => setLocations(data))
        .catch(error => setError(error.message));
    }, [token]);

   
    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {locations.length > 0 ? (
                <ul>
                    {locations.map((location) => (
                        <li key={location.id}>
                            <button onClick={() => navigate(`/map/${location.id}`)}>
                                {location.title}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No locations available.</p>
            )}
        </div>
    );
};

export default Dashboard;
