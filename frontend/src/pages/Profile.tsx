import React, { useEffect, useState } from "react";
import "../styles/profile.css";

interface Donation {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface User {
  name: string;
  profileImage: string;
  location: string;
  bio: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: "",
    profileImage: "/default-profile.jpg",
    location: "",
    bio: "",
  });

  const [donations, setDonations] = useState<Donation[]>([]);

  return (
    <div className="profile-page">

      {/* ===== صندوق بيانات المستخدم ===== */}
      <div className="user-box">
        <div className="profile-header">

          <div className="profile-pic-wrapper">
            <img src={user.profileImage} className="profile-pic" />
          </div>

          <div className="profile-info">
            <h2>{user.name || "الاسم"}</h2>
            <span>{user.location || "الموقع"}</span>
            <p>{user.bio || "لا يوجد بايو بعد"}</p>

            <div className="profile-buttons">
              <button className="btn edit-btn">تعديل الملف الشخصي</button>
              <button className="btn add-donation-btn">إضافة تبرع</button>
            </div>
          </div>

        </div>
      </div>

      {/* ===== التبرعات ===== */}
      <div className="donations-box">
        <h3 className="donations-title">التبرعات</h3>

        {donations.length === 0 ? (
          <p className="no-donations">لا يوجد تبرعات</p>
        ) : (
          <div className="donations-grid">
            {donations.map((d) => (
              <div key={d._id} className="donation-card">
                <img src={d.imageUrl} />
                <h4>{d.name}</h4>
                <p>{d.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
