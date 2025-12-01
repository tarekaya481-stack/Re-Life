import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">مرحبًا بك في ReLife</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/donate" className="p-4 bg-green-500 text-white rounded text-center hover:bg-green-600">
          أضف تبرع
        </Link>
        <Link href="/items" className="p-4 bg-blue-500 text-white rounded text-center hover:bg-blue-600">
          معرض التبرعات
        </Link>
        <Link href="/messages" className="p-4 bg-yellow-500 text-white rounded text-center hover:bg-yellow-600">
          الرسائل
        </Link>
        <Link href="/profile" className="p-4 bg-purple-500 text-white rounded text-center hover:bg-purple-600">
          الملف الشخصي
        </Link>
        <Link href="/map" className="p-4 bg-red-500 text-white rounded text-center hover:bg-red-600">
          الخريطة
        </Link>
      </div>
    </div>
  );
}
