import React from "react";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">

      {/* ===== HERO SECTION ===== */}
 <section className="hero-section">
  <img
    src="/Donate.jpg"
    alt="donation hero"
    className="hero-image"
  />

  <div className="hero-center">
    <h1>ساهم في تغيير حياة شخص</h1>
    <p>تبرع الآن وشارك الخير مع المحتاجين في مجتمعك.</p>

    <div className="hero-buttons">
      <a href="/upload" className="btn main-btn">إضافة تبرع</a>
      <a href="/items" className="btn secondary-btn">معرض التبرعات</a>
    </div>
  </div>
</section>


      {/* ===== BOXES SECTION UNDER HERO ===== */}
      <section className="content-section">

       <div className="box">
  <h2>فضل التبرع</h2>
  
  <p className="quran-verse">
    ﴿ مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً ﴾  
    <span className="verse-ref">[البقرة: 245]</span>
  </p>
  
  <p>
    وقال رسول الله ﷺ: "أحب الناس إلى الله أنفعهم للناس".
    <br />
    التبرع يفتح بابًا للخير ويجعل الأجر مضاعفًا، ويساعد المحتاجين على تحسين حياتهم.
  </p>
</div>

        <div className="box">
          <h2>كيف تتبرع؟</h2>
          <p>
            1- اختر الشيء الذي تريد التبرع به.<br />
            2- ارفع صورته على الموقع.<br />
            3- سيتم عرضه للمحتاجين في منطقتك.<br />
            4- تواصل مع المستفيد وسلّم التبرع.
          </p>
        </div>

        <div className="box">
          <h2>رسالتنا</h2>
          <p>
            نهدف في ReLife إلى نشر روح التكافل وربط المتبرعين بالمحتاجين بسهولة
            وسرعة، لإحياء الأمل في حياة الكثيرين.
          </p>
        </div>

      </section>




    </div>
  );
};

export default Home;
