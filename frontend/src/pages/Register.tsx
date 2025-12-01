import React, { useState } from "react";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", location: "", bio: "", profileImage: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "profileImage") {
      setFormData({ ...formData, profileImage: (e.target as HTMLInputElement).files![0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key as keyof typeof formData] as any);
      }
      const res = await fetch("http://localhost:5000/api/register", { method: "POST", body: data });
      if (!res.ok) throw new Error("Failed to register");
      const result = await res.json();
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التسجيل");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-logo">ReLife</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="username" placeholder="اسم الحساب" className="register-input" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="البريد الإلكتروني" className="register-input" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="كلمة المرور" className="register-input" value={formData.password} onChange={handleChange} required />
          <input type="text" name="location" placeholder="الموقع" className="register-input" value={formData.location} onChange={handleChange} />
          <textarea name="bio" placeholder="بايو عنك" className="register-input" value={formData.bio} onChange={handleChange}></textarea>
          <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="register-input" />
          <button type="submit" className="register-btn">تسجيل</button>
        </form>
      </div>
    </div>
  );
}
