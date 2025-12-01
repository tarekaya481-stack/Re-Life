import React, { useEffect, useState } from "react";
import "../styles/items.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// أيقونة الدبابيس
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

interface Donation {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  lat: number;
  lng: number;
  distance?: number; // المسافة من المستخدم
}

const Items: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // جلب التبرعات من السيرفر
  useEffect(() => {
    fetch("http://localhost:5000/api/donations")
      .then((res) => res.json())
      .then((data) => setDonations(data))
      .catch((err) => console.error(err));
  }, []);

  // دالة لحساب المسافة بالكيلومتر بين نقطتين
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSetLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);

        // حساب المسافة لكل تبرع
        const updated = donations.map((d) => ({
          ...d,
          distance: getDistance(loc.lat, loc.lng, d.lat, d.lng),
        }));
        setDonations(updated);
      },
      (err) => alert("تعذر الحصول على الموقع: " + err.message)
    );
  };

  return (
    <div className="items-container">
  <h1>معرض التبرعات</h1>

  <div className="donations-list">
    {donations.map((d) => (
      <div key={d._id} className="donation-card">
        <img src={d.imageUrl} alt={d.name} />
        <h3>{d.name}</h3>
        <p>{d.description}</p>
        <span>الفئة: {d.category}</span>
        {d.distance && <span>المسافة منك: {d.distance.toFixed(1)} كم</span>}
      </div>
    ))}
  </div>

  <h2>خريطة التبرعات</h2>
  <MapContainer
    center={userLocation ? [userLocation.lat, userLocation.lng] : [30.0444, 31.2357]}
    zoom={userLocation ? 12 : 6}
    style={{ height: "400px", width: "100%", borderRadius: "12px" }}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {donations.map((d) => (
      <Marker key={d._id} position={[d.lat, d.lng]} icon={markerIcon}>
        <Popup>
          <strong>{d.name}</strong>
          <br />
          {d.description}
          <br />
          الفئة: {d.category}
          {d.distance && <br />}
          {d.distance && `المسافة منك: ${d.distance.toFixed(1)} كم`}
        </Popup>
      </Marker>
    ))}
    {userLocation && (
      <Marker
        position={[userLocation.lat, userLocation.lng]}
        icon={new L.Icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
          iconSize: [35, 35],
          iconAnchor: [17, 35],
        })}
      >
        <Popup>موقعك الحالي</Popup>
      </Marker>
    )}
  </MapContainer>

  {/* الزر بعد الخريطة */}
  <button className="btn location-btn" onClick={handleSetLocation}>
    {userLocation ? "تم تحديد موقعك" : "حدد موقعك لمعرفة المسافة"}
  </button>
</div>
  );
};

export default Items;
