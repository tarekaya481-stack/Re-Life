import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";

type Item = { _id: string; title: string; location: { coordinates: [number, number] } };

export default function MapPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/items").then(res => setItems(res.data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">الخريطة</h1>
      <MapContainer center={[30.0444, 31.2357]} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {items.map(item => (
          <Marker key={item._id} position={[item.location.coordinates[1], item.location.coordinates[0]]} />
        ))}
      </MapContainer>
    </div>
  );
}
