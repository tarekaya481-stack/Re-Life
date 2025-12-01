import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Donate() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleDonate = async () => {
    if (!title || !description) return alert("املئي كل الحقول");
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ownerId", userId || "");
    if (image) formData.append("image", image);

    await axios.post("http://localhost:5000/api/items/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("تم إضافة التبرع!");
    router.push("/items");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">أضف تبرع</h1>
      <input
        type="text"
        placeholder="اسم الغرض"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        placeholder="الوصف"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mb-4" />
      <button onClick={handleDonate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        أضف التبرع
      </button>
    </div>
  );
}
