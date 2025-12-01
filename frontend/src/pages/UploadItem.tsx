import React, { useState } from "react";
import "../styles/upload.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// أيقونة Marker
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const DraggableMarker = ({ location, setLocation }: any) => {
  const [position, setPosition] = useState(location);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPos = marker.getLatLng();
          setPosition(newPos);
          setLocation({ lat: newPos.lat, lng: newPos.lng });
        },
      }}
      position={position}
      icon={markerIcon}
    />
  );
};

const UploadItem: React.FC = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("category", category);
    if (image) formData.append("image", image);
    if (location) {
      formData.append("lat", location.lat.toString());
      formData.append("lng", location.lng.toString());
    }

    try {
      const res = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("تم إضافة التبرع بنجاح!");
        setItemName("");
        setDescription("");
        setCategory("");
        setImage(null);
        setLocation(null);
      } else {
        alert("حدث خطأ، حاول مرة أخرى.");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ، تحقق من الاتصال بالسيرفر.");
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => alert("تعذر الحصول على الموقع: " + err.message)
    );
  };

  return (
    <div className="upload-container">
      <section
  className="hero"
  style={{
    backgroundImage: 'url("/photo.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '200px', // ممكن تعدلي حسب الحاجة
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
  }}
>
  <h1>أضف التبرع</h1>
  <p>شارك في صنع فرق حقيقي عبر التبرع بما لا تحتاجه لمن يحتاجه.</p>
</section>


      <section className="form-section">
        <form className="upload-form" onSubmit={handleSubmit}>
          <label>اسم التبرع</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />

          <label>الوصف</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <label>الفئة</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">اختر الفئة</option>
            <option value="ملابس">ملابس</option>
            <option value="كتب">كتب</option>
            <option value="أجهزة">أجهزة</option>
            <option value="أخرى">أخرى</option>
          </select>

          <label>رفع صورة</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            required
          />

          <label>تحديد الموقع</label>
          <button type="button" className="btn location-btn" onClick={handleGetLocation}>
            {location
              ? `تم تحديد الموقع: ${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}`
              : "حدد موقعك"}
          </button>

          {/* الخريطة */}
          {location && (
            <div className="map-section">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                style={{ height: "300px", width: "100%", borderRadius: "12px", marginTop: "15px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker location={location} setLocation={setLocation} />
              </MapContainer>
            </div>
          )}

          <button type="submit" className="btn submit-btn">أضف التبرع</button>
        </form>
      </section>
    </div>
  );
};

export default UploadItem;
