import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {
    const { id } = useParams();
    const [mapData, setMapData] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`http://localhost:5000/api/map/${id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(data => setMapData(data))
        .catch(error => console.error("Error:", error));
    }, [id]);

    return (
        <div>
            <h1>{mapData ? mapData.name : "Loading..."}</h1>
            {mapData ? (
                <MapContainer center={mapData.center} zoom={mapData.zoom} style={{ height: "500px", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={mapData.center}>
                        <Popup>{mapData.name}</Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
};

export default MapView;
